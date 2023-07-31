variable "env" {
  default   = "dev"
}

variable "region" {
  default   = "ap-southeast-2"
}

variable "ssm_arn" {
  default = ""
  description = "secret manager arn"
}

variable "subn_a_id" {
  description = "id of subnet A inside fromeroad vpc"
}

variable "subn_b_id" {
  description = "id of subnet B inside fromeroad vpc"
}

variable "vpc_id" {
  description = "id of the VPC to put networking components inside of"
}

variable "ecs_sg_id" {
  description = "security group for ecs task to access things"
}

variable "ecs_role_arn" {
  description = "security group for ecs task to access things"
}

variable "rds_endpoint" {
  description = "security group for ecs task to access things"
}
