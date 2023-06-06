terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0.1"
    }
  }
  backend "s3" { }
}

# Define the provider and AWS region
provider "aws" {
  region = "ap-southeast-2"
  access_key = var.ACCESS_KEY
  secret_key = var.SECRET_KEY
}

# Create a VPC
resource "aws_vpc" "fr-vpc" {
  cidr_block = "10.0.0.0/16"
  enable_dns_hostnames = true
  tags = {
    Name = "fr-vpc"
  }
}

resource "aws_internet_gateway" "gw" { 
  vpc_id = aws_vpc.fr-vpc.id
}


resource "aws_route_table" "fr-rt" {
  vpc_id = aws_vpc.fr-vpc.id

  route {
    cidr_block = "0.0.0.0/0"
    gateway_id = aws_internet_gateway.gw.id
  }

  tags = {
    Name = "fr-rt"
  }
}

resource "aws_main_route_table_association" "fr-rt" {
  vpc_id         = aws_vpc.fr-vpc.id
  route_table_id = aws_route_table.fr-rt.id
}

data "aws_availability_zone" "fr-az-a" {
  name = "ap-southeast-2a"
}

data "aws_availability_zone" "fr-az-b" {
  name = "ap-southeast-2b"
}

data "aws_iam_role" "ecs_task_execution_role" {
  name = "ecsTaskExecutionRole"
}

# Create a subnet
resource "aws_subnet" "fr-subn-a" {
  vpc_id     = aws_vpc.fr-vpc.id
  cidr_block = "10.0.0.0/17"
  availability_zone = data.aws_availability_zone.fr-az-a.name
}

# Create a subnet
resource "aws_subnet" "fr-subn-b" {
  vpc_id     = aws_vpc.fr-vpc.id
  cidr_block = "10.0.128.0/17"
  availability_zone = data.aws_availability_zone.fr-az-b.name
}

# Create an ECS cluster
resource "aws_ecs_cluster" "fr-cluster" {
  name = "fr-cluster-${var.env}"
}

# Create an ECR repository for the Docker image
resource "aws_ecr_repository" "fromeroad_ecr" {
  name = "fr_ecr_${var.env}"
}
# Create an ECS task definition
resource "aws_ecs_task_definition" "fr-ecs-task-definition" {
  family                   = "fr-ecs-task-definition-${var.env}"
  network_mode             = "awsvpc"
  requires_compatibilities = [ "FARGATE" ]
  cpu                      = 256
  memory                   = 512
  execution_role_arn       = data.aws_iam_role.ecs_task_execution_role.arn
  container_definitions    = jsonencode([
    {
      "name": "fr-cnt-api-${var.env}",
      "image": "${aws_ecr_repository.fromeroad_ecr.repository_url}:latest",
      "portMappings": [
        {
          "name": "fr-cnt-api-dev-8080-tcp",
          "containerPort": 8080,
          "hostPort": 8080,
          "protocol": "tcp",
          "appProtocol": "http"
        },
        {
          "name": "fr-cnt-api-dev-8443-tcp",
          "containerPort": 8443,
          "hostPort": 8443,
          "protocol": "tcp",
          "appProtocol": "http"
        }
      ],
      "cpu"    = 256
      "memory" = 512
      "environment": [
        { "name": "ENV", "value": "${var.env}" },
        { "name": "RDS_DB", "value": "${aws_rds_cluster.fr_rds.endpoint}" },
      ],
      "secrets" : [
        {
          "name": "SES_KEY",
          "valueFrom": "${var.SM_ARN}:fr/${var.env}/secrets-227gKr:SES_KEY::"
        },
        {
          "name": "SES_SECRET",
          "valueFrom": "${var.SM_ARN}:fr/${var.env}/secrets-227gKr:SES_SECRET::"
        },
        {
          "name": "CRYPTO_KEY",
          "valueFrom": "${var.SM_ARN}:fr/${var.env}/secrets-227gKr:CRYPTO_KEY::"
        },
        {
          "name": "JWT_SECRET",
          "valueFrom": "${var.SM_ARN}:fr/${var.env}/secrets-227gKr:JWT_SECRET::"
        },
        {
          "name": "S3_SECRET",
          "valueFrom": "${var.SM_ARN}:fr/${var.env}/secrets-227gKr:S3_SECRET::"
        },
        {
          "name": "S3_KEY",
          "valueFrom": "${var.SM_ARN}:fr/${var.env}/secrets-227gKr:S3_KEY::"
        },
        {
          "name": "RDS_USER",
          "valueFrom": "${var.SM_ARN}:fr/${var.env}/secrets-227gKr:RDS_USER::"
        },
        {
          "name": "RDS_PASSWORD",
          "valueFrom": "${var.SM_ARN}:fr/${var.env}/secrets-227gKr:RDS_PASSWORD::"
        }
      ],
      "healthCheck": {
        "command": [
          "CMD-SHELL",
          "curl -f http://localhost:8080/ || exit 1"
        ],
        "interval": 15,
        "timeout": 5,
        "retries": 3,
        "startPeriod": 5
      }
    }
  ])
}

# Create a security group for the ECS service
resource "aws_security_group" "ecs_sg" {
  name        = "ecs-sg"
  description = "Security group for ECS service"

  vpc_id = aws_vpc.fr-vpc.id

  ingress {
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
    description      = ""
    ipv6_cidr_blocks = []
    prefix_list_ids  = []
    security_groups  = []
    self             = false
  }
  ingress {
    from_port   = 443
    to_port     = 443
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
    description      = ""
    ipv6_cidr_blocks = []
    prefix_list_ids  = []
    security_groups  = []
    self             = false
  }
  ingress {
    from_port   = 80
    to_port     = 8080
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
    description      = ""
    ipv6_cidr_blocks = []
    prefix_list_ids  = []
    security_groups  = []
    self             = false
  }
  ingress {
    from_port   = 443
    to_port     = 8080
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
    description      = ""
    ipv6_cidr_blocks = []
    prefix_list_ids  = []
    security_groups  = []
    self             = false
  } 
  egress {
    from_port        = 0
    to_port          = 0
    protocol         = "-1"
    cidr_blocks      = ["0.0.0.0/0"]
    ipv6_cidr_blocks = ["::/0"]
    description      = ""
    prefix_list_ids  = []
    security_groups  = []
    self             = false
  }
}

resource "aws_security_group" "rds_sg" {
  name        = "rds-sg"
  description = "Security group for RDS service"

  vpc_id = aws_vpc.fr-vpc.id

  ingress {
    from_port   = 3306
    to_port     = 3306
    protocol    = "tcp"
    cidr_blocks = []
    description      = ""
    ipv6_cidr_blocks = []
    prefix_list_ids  = []
    security_groups  = [aws_security_group.ecs_sg.id]
    self             = false
  }
  egress {
    from_port        = 0
    to_port          = 0
    protocol         = "-1"
    cidr_blocks      = ["0.0.0.0/0"]
    ipv6_cidr_blocks = ["::/0"]
    description      = ""
    prefix_list_ids  = []
    security_groups  = []
    self             = false
  }
}

# Create a load balancer
resource "aws_lb" "load_balancer" {
  name               = "fr-lb-${var.env}"
  load_balancer_type = "application"
  subnets            = [aws_subnet.fr-subn-a.id, aws_subnet.fr-subn-b.id]

  security_groups = [aws_security_group.ecs_sg.id]
}

# Create a target group
resource "aws_lb_target_group" "target_group" {
  name     = "fr-tg"
  port     = 8080
  protocol = "HTTP"
  protocol_version = "HTTP1"

  vpc_id               = aws_vpc.fr-vpc.id
  target_type          = "ip"
  deregistration_delay = 180
  ip_address_type = "ipv4"
  load_balancing_cross_zone_enabled = "use_load_balancer_configuration"

  health_check {
    enabled             = true
    healthy_threshold   = 3
    interval            = 15
    matcher             = "200"
    path                = "/"
    port                = "traffic-port"
    protocol            = "HTTP"
    timeout             = 5
    unhealthy_threshold = 2
  }
  stickiness {
    cookie_duration = 21600
    enabled         = false
    type            = "lb_cookie"
  }
}

# Create a listener
resource "aws_lb_listener" "listener" {
  load_balancer_arn = aws_lb.load_balancer.arn
  port              = 443
  protocol          = "HTTPS"
  certificate_arn   = "arn:aws:acm:ap-southeast-2:384402655318:certificate/961c7e63-2e5c-4be4-90db-196b9cd85c3d"
  default_action {
    type             = "forward"
    target_group_arn = aws_lb_target_group.target_group.arn
  }
}

# Create an ECS service
resource "aws_ecs_service" "fr-ecs-service" {
  name            = "fr-ecs-srv-${var.env}"
  cluster         = aws_ecs_cluster.fr-cluster.id
  task_definition = aws_ecs_task_definition.fr-ecs-task-definition.arn
  desired_count   = 1
  deployment_maximum_percent = 200
  deployment_minimum_healthy_percent = 100
  wait_for_steady_state = false
  load_balancer {
    target_group_arn = aws_lb_target_group.target_group.arn
    container_name   = "fr-cnt-api-${var.env}"
    container_port   = 8080
  }

  network_configuration {
    subnets = [aws_subnet.fr-subn-a.id, aws_subnet.fr-subn-b.id]
    security_groups = [aws_security_group.ecs_sg.id]
  }
  depends_on = [
    aws_lb.load_balancer,
    aws_ecs_task_definition.fr-ecs-task-definition,
    aws_vpc.fr-vpc,
    aws_route_table.fr-rt,
    aws_security_group.ecs_sg
  ]
}

# Create an RDS database
resource "aws_rds_cluster_instance" "fr_rds_instance" {
  count              = 1
  identifier         = "${aws_rds_cluster.fr_rds.cluster_identifier}-${count.index}"
  cluster_identifier = aws_rds_cluster.fr_rds.id
  instance_class     = "db.t3.medium"
  engine             = aws_rds_cluster.fr_rds.engine
  engine_version     = aws_rds_cluster.fr_rds.engine_version
  publicly_accessible = true
}

resource "aws_rds_cluster" "fr_rds" {
  cluster_identifier = "fr-rds-${var.env}"
  engine             = "aurora-mysql"
  engine_mode        = "provisioned"
  engine_version     = "8.0.mysql_aurora.3.03.1"
  master_username    = "${var.RDS_USER}_${var.env}"
  master_password    = var.RDS_PASSWORD
  copy_tags_to_snapshot = true
  network_type = "IPV4"
  skip_final_snapshot = true
  storage_encrypted = true
  port = 3306
  db_subnet_group_name = aws_db_subnet_group.fr-rds-subn-group.name
  serverlessv2_scaling_configuration {
    max_capacity = 2
    min_capacity = 0.5
  }
  lifecycle {
    ignore_changes = [
      engine_version,
      availability_zones,
      master_username,
      master_password,
    ]
  }
  vpc_security_group_ids = [aws_security_group.rds_sg.id]
}

# Create an RDS subnet group
resource "aws_db_subnet_group" "fr-rds-subn-group" {
  name       = "fr-rds-subn-group-${var.env}"
  subnet_ids = [aws_subnet.fr-subn-a.id, aws_subnet.fr-subn-b.id]
}

# Create an S3 bucket
# resource "aws_s3_bucket" "fr-bucket" {
#   bucket = "fromeroad-${var.env}"
# }

# resource "aws_s3_bucket_ownership_controls" "fr-bucket-ownership" {
#   bucket = aws_s3_bucket.fr-bucket.id
#   rule {
#     object_ownership = "BucketOwnerPreferred"
#   }
# }

# resource "aws_s3_bucket_public_access_block" "fr-bucket-access" {
#   bucket = aws_s3_bucket.fr-bucket.id

#   block_public_acls       = false
#   block_public_policy     = false
#   ignore_public_acls      = false
#   restrict_public_buckets = false
# }

# resource "aws_s3_bucket_acl" "fr-bucket-acl" {
#   depends_on = [
#     aws_s3_bucket_ownership_controls.fr-bucket-ownership,
#     aws_s3_bucket_public_access_block.fr-bucket-access
#   ]

#   bucket = aws_s3_bucket.fr-bucket.id
#   acl    = "public-read"
# }

# Create a Route 53 zone
# resource "aws_route53_zone" "fromeroad" {
#   name = "fromeroad.com"
# }

# # Create a Route 53 zone
# resource "aws_route53_zone" "fromeroad_api" {
#   name = "api.fromeroad.com"
# }

# Create a DNS record in Route 53
# resource "aws_route53_record" "fr-api-record" {
#   zone_id = aws_route53_zone.fromeroad.id
#   name    = "api.fromeroad.com"
#   type    = "A"

#   alias {
#     name = aws_lb.load_balancer.dns_name
#     zone_id = aws_lb.load_balancer.zone_id
#     evaluate_target_health = true
#   }
#}

# # Create a DNS record in Route 53
# resource "aws_route53_record" "fr-api-dev-record" {
#   zone_id = aws_route53_zone.fromeroad_api.id
#   name    = "dev.api.fromeroad.com"
#   type    = "CNAME"
#   ttl     = "300"
#   records = [aws_route53_record.fr-api-record.name]
# }

# # Create a DNS record in Route 53
# resource "aws_route53_record" "fr-api-test-record" {
#   zone_id = aws_route53_zone.fromeroad_api.id
#   name    = "test.api.fromeroad.com"
#   type    = "CNAME"
#   ttl     = "300"
#   records = [aws_route53_record.fr-api-record.name]
# }