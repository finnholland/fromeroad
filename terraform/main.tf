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
  region     = var.region
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
  region       = var.region
  ssm_arn      = module.secrets_manager.ssm_arn
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

module "route_53" {
  source = "./modules/route_53"
  lb_dns_name  = module.ecs.lb_dns_name
  lb_zone_id   = module.ecs.lb_zone_id
}
module "secrets_manager" {
  source = "./modules/secrets_manager"
  env    = var.env
}
module "iam" {
  source  = "./modules/iam"
  ssm_arn = module.secrets_manager.ssm_arn
  env     = var.env
}
module "ses" {
  source = "./modules/ses"
  env    = var.env
}
# Reference S3 bucket
data "aws_s3_bucket" "fr_bucket" {
  bucket = "fromeroad-${var.env}"
}