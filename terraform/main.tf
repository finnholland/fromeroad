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


data "aws_availability_zone" "fr-az-a" {
  name = "ap-southeast-2a"
}

data "aws_availability_zone" "fr-az-b" {
  name = "ap-southeast-2b"
}

data "aws_iam_role" "ecs_task_execution_role" {
  name = "ecsTaskExecutionRole"
}

module "networking" {
  source = "./modules/networking"
  env    = var.env
  az_a_name = data.aws_availability_zone.fr-az-a.name
  az_b_name = data.aws_availability_zone.fr-az-b.name
}

module "ecs" {
  source       = "./modules/ecs"
  env          = var.env
  SM_ARN       = var.SM_ARN
  ecs_role_arn = data.aws_iam_role.ecs_task_execution_role.arn
  subn_a_id    = module.networking.fr_subn_a_id
  subn_b_id    = module.networking.fr_subn_b_id
  vpc_id       = module.networking.fr_vpc_id
  ecs_sg_id    = module.networking.fr_ecs_sg_id
  rds_endpoint = module.rds.rds_endpoint
}

module "rds" {
  source          = "./modules/rds"
  env             = var.env
  RDS_USER        = var.RDS_USER
  RDS_PASSWORD    = var.RDS_PASSWORD
  subn_group_name = module.networking.subn_group_name 
  rds_sg_id          = module.networking.fr_rds_sg_id
}

# Create an S3 bucket
# resource "aws_s3_bucket" "fr_bucket" {
#   bucket = "fromeroad-${var.env}"
# }

# resource "aws_s3_bucket_ownership_controls" "fr_bucket_ownership" {
#   bucket = aws_s3_bucket.fr_bucket.id
#   rule {
#     object_ownership = "BucketOwnerPreferred"
#   }
# }

# resource "aws_s3_bucket_public_access_block" "fr_bucket_access" {
#   bucket = aws_s3_bucket.fr_bucket.id

#   block_public_acls       = false
#   block_public_policy     = false
#   ignore_public_acls      = false
#   restrict_public_buckets = false
# }

# resource "aws_s3_bucket_acl" "fr_bucket_acl" {
#   depends_on = [
#     aws_s3_bucket_ownership_controls.fr_bucket_ownership,
#     aws_s3_bucket_public_access_block.fr_bucket_access
#   ]

#   bucket = aws_s3_bucket.fr_bucket.id
#   acl    = "public-read"
# }

# Create a Route 53 zone
# resource "aws_route53_zone" "fromeroad" {
#   name = "fromeroad.com"
# }

# Create a DNS record in Route 53
# resource "aws_route53_record" "fr_api_record" {
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
# resource "aws_route53_record" "fr_api_dev_record" {
#   zone_id = aws_route53_zone.fromeroad_api.id
#   name    = "dev.api.fromeroad.com"
#   type    = "A"

#   alias {
#     name = aws_lb.load_balancer.dns_name
#     zone_id = aws_lb.load_balancer.zone_id
#     evaluate_target_health = true
#   }
# }