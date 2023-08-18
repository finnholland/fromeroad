#####################################
################ ECS ################
#####################################
# Create an ECS cluster
resource "aws_ecs_cluster" "fr_cluster" {
  name = "fr-cluster-${var.env}"
}

# Create an ECS service
resource "aws_ecs_service" "fr_ecs_service" {
  name            = "${var.env}-service"
  cluster         = aws_ecs_cluster.fr_cluster.id
  desired_count   = 1
  deployment_maximum_percent = 200
  deployment_minimum_healthy_percent = 100
  wait_for_steady_state = false
  enable_ecs_managed_tags = true
  task_definition = aws_ecs_task_definition.fr_ecs_task_definition.arn
  platform_version = "LATEST"
  launch_type = "FARGATE"
  deployment_controller {
    type = "ECS"
  }
  depends_on = [
    aws_lb.load_balancer,
    aws_ecs_task_definition.fr_ecs_task_definition
  ]
  deployment_circuit_breaker {
    enable = true
    rollback = true
  }
  load_balancer {
    container_name   = "container-${var.env}"
    container_port   = 8080
    target_group_arn = aws_lb_target_group.target_group.arn
  }
  network_configuration {
    assign_public_ip = true
    security_groups = [ var.ecs_sg_id ]
    subnets = [ var.subn_a_id, var.subn_b_id ]
  }
}

# Create an ECS task definition
resource "aws_ecs_task_definition" "fr_ecs_task_definition" {
  family                   = "fr-ecs-task-definition-${var.env}"
  network_mode             = "awsvpc"
  requires_compatibilities = [ "FARGATE" ]
  cpu                      = 256
  memory                   = 512
  execution_role_arn       = var.ecs_role_arn
  container_definitions    = jsonencode([
    {
      "name": "container-${var.env}",
      "image": "${data.aws_ecr_repository.fromeroad_ecr.repository_url}:latest",
      "portMappings": [
        {
          "name": "container-${var.env}-8080-tcp",
          "containerPort": 8080,
          "hostPort": 8080,
          "protocol": "tcp",
          "appProtocol": "http"
        },
        {
          "name": "container-${var.env}-8443-tcp",
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
        { "name": "RDS_DB", "value": "${var.rds_endpoint}" },
      ],
      "secrets" : [
        {
          "name": "SES_KEY",
          "valueFrom": "${var.SES_KEY}"
        },
        {
          "name": "SES_SECRET",
          "valueFrom": "${var.SES_SECRET}"
        },
        {
          "name": "CRYPTO_KEY",
          "valueFrom": "${var.ssm_arn}:CRYPTO_KEY::"
        },
        {
          "name": "JWT_SECRET",
          "valueFrom": "${var.ssm_arn}:JWT_SECRET::"
        },
        {
          "name": "S3_SECRET",
          "valueFrom": "${var.S3_SECRET}"
        },
        {
          "name": "S3_KEY",
          "valueFrom": "${var.S3_KEY}"
        },
        {
          "name": "RDS_USER",
          "valueFrom": "${var.ssm_arn}:RDS_USER::"
        },
        {
          "name": "RDS_PASSWORD",
          "valueFrom": "${var.ssm_arn}:RDS_PASSWORD::"
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
      },
      "logConfiguration": {
        "logDriver" : "awslogs",
        "options" : {
          "awslogs-group" : "${aws_cloudwatch_log_group.logs.name}",
          "awslogs-region" : "${var.region}",
          "awslogs-create-group" : "true",
          "awslogs-stream-prefix" : "/ecs"

        }
      }
    }
  ])
  runtime_platform {
    operating_system_family = "LINUX"
    cpu_architecture        = "X86_64"
  }
}

resource "aws_cloudwatch_log_group" "logs" {
  name = "fr_logs_${var.env}"
  retention_in_days = 7
  tags = {
    Environment = "${var.env}"
    Application = "fromeroad"
  }
}

resource "aws_appautoscaling_target" "ecs_target" {
  max_capacity       = 4
  min_capacity       = 1
  resource_id        = "service/${aws_ecs_cluster.fr_cluster.name}/${aws_ecs_service.fr_ecs_service.name}"
  scalable_dimension = "ecs:service:DesiredCount"
  service_namespace  = "ecs"
}

resource "aws_appautoscaling_policy" "ecs_asp" {
  name               = "scale-policy"
  policy_type        = "TargetTrackingScaling"
  resource_id        = aws_appautoscaling_target.ecs_target.resource_id
  scalable_dimension = aws_appautoscaling_target.ecs_target.scalable_dimension
  service_namespace  = aws_appautoscaling_target.ecs_target.service_namespace

  target_tracking_scaling_policy_configuration {
    target_value = 50
    predefined_metric_specification {
      predefined_metric_type = "ECSServiceAverageCPUUtilization"
    }
    scale_in_cooldown = 0
    scale_out_cooldown = 0
    disable_scale_in = true
  }
  depends_on = [ aws_ecs_service.fr_ecs_service ]
}

#####################################
########### TARGET GROUP ############
#####################################

resource "aws_lb_target_group" "target_group" {
  name     = "fr-tg"
  port     = 8080
  protocol = "HTTP"
  protocol_version = "HTTP1"

  vpc_id               = var.vpc_id
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

#####################################
########### LOAD BALANCER ###########
#####################################

data "aws_acm_certificate" "certificate" {
  domain   = "www.fromeroad.com"
  statuses = ["ISSUED"]
}

resource "aws_lb" "load_balancer" {
  name               = "fr-lb-${var.env}"
  load_balancer_type = "application"
  subnets            = [var.subn_a_id, var.subn_b_id]

  security_groups = [var.ecs_sg_id]
}

resource "aws_lb_listener" "listener" {
  load_balancer_arn = aws_lb.load_balancer.arn
  port              = 443
  protocol          = "HTTPS"
  certificate_arn   = aws_acm_certificate.certificate.arn
  default_action {
    type             = "forward"
    target_group_arn = aws_lb_target_group.target_group.arn
  }
}


#####################################
################ ECR ################
#####################################
# Reference the ECR repository for the Docker image
data "aws_ecr_repository" "fromeroad_ecr" {
  name = "fr_ecr_${var.env}"
}