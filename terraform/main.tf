terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 4.0"
    }
  }
  backend "s3" {
    bucket = "fromeroad"
    key    = "dev.tfstate"
    region = "ap-southeast-2"
  }
}

# Define the provider and AWS region
provider "aws" {
  region = "ap-southeast-2"
  profile = "chamonix"
}

# Create a VPC
resource "aws_vpc" "my_vpc" {
  cidr_block = "10.0.0.0/16"
}

# Create a subnet
resource "aws_subnet" "my_subnet" {
  vpc_id     = aws_vpc.my_vpc.id
  cidr_block = "10.0.0.0/24"
}

# Create an ECS cluster
resource "aws_ecs_cluster" "my_cluster" {
  name = "my-cluster"
}

# Create an ECR repository for the Docker image
resource "aws_ecr_repository" "fromeroad_ecr" {
  name = "fromeroad_ecr"
}

# Create an ECS task definition
resource "aws_ecs_task_definition" "my_task_definition" {
  family                   = "my-task-definition"
  container_definitions    = <<EOF
[
  {
    "name": "my-container",
    "image": "${aws_ecr_repository.my_repository.repository_url}:latest",
    "portMappings": [
      {
        "containerPort": 3000,
        "hostPort": 3000
      }
    ]
  }
]
EOF
}

# Create an ECS service
resource "aws_ecs_service" "my_service" {
  name            = "my-service"
  cluster         = aws_ecs_cluster.my_cluster.id
  task_definition = aws_ecs_task_definition.my_task_definition.arn
  desired_count   = 1

  network_configuration {
    subnets = [aws_subnet.my_subnet.id]
  }
}

# Create an RDS database
resource "aws_db_instance" "fromeroad_rds" {
  engine               = "mysql"
  instance_class       = "db.t2.micro"
  allocated_storage    = 10
  storage_type         = "gp2"
  username             = var.RDS_USER
  password             = var.RDS_PASSWORD
  db_subnet_group_name = aws_db_subnet_group.my_subnet_group.name
}

# Create an RDS subnet group
resource "aws_db_subnet_group" "my_subnet_group" {
  name       = "my-subnet-group"
  subnet_ids = [aws_subnet.my_subnet.id]
}

# Create an S3 bucket
resource "aws_s3_bucket" "my_bucket" {
  bucket = "my-bucket"
  acl    = "private"
}

# Create a Route 53 zone
resource "aws_route53_zone" "fromeroad" {
  name = "fromeroad.com"
}

# Create a Route 53 zone
resource "aws_route53_zone" "fromeroad_api" {
  name = "api.fromeroad.com"
}

# Create a DNS record in Route 53
resource "aws_route53_record" "my_record" {
  zone_id = aws_route53_zone.my_zone.zone_id
  name    = "api.example.com"
  type    = "A"
  ttl     = "300"
  records = [aws_ecs_service.my_service.load_balancer.0.dns_name]
}