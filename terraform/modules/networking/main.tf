#####################################
############ VPC AND RT #############
#####################################

# Create a VPC
resource "aws_vpc" "fr_vpc" {
  cidr_block = "10.0.0.0/16"
  enable_dns_hostnames = true
  tags = {
    Name = "fr-vpc"
  }
}

resource "aws_internet_gateway" "gw" { 
  vpc_id = aws_vpc.fr_vpc.id
}


resource "aws_route_table" "fr_rt" {
  vpc_id = aws_vpc.fr_vpc.id

  route {
    cidr_block = "0.0.0.0/0"
    gateway_id = aws_internet_gateway.gw.id
  }

  tags = {
    Name = "fr-rt"
  }
}

resource "aws_main_route_table_association" "fr_rt_asn" {
  vpc_id         = aws_vpc.fr_vpc.id
  route_table_id = aws_route_table.fr_rt.id
}

#####################################
############## SUBNETS ##############
#####################################



# Create a subnet
resource "aws_subnet" "fr_subn_a" {
  vpc_id     = aws_vpc.fr_vpc.id
  cidr_block = "10.0.0.0/17"
  availability_zone = var.az_a_name
}

# Create a subnet
resource "aws_subnet" "fr_subn_b" {
  vpc_id     = aws_vpc.fr_vpc.id
  cidr_block = "10.0.128.0/17"
  availability_zone = var.az_b_name
}
# Create an RDS subnet group
resource "aws_db_subnet_group" "fr_rds_subn_group" {
  name       = "fr_rds_subn_group-${var.env}"
  subnet_ids = [aws_subnet.fr_subn_a.id, aws_subnet.fr_subn_b.id]
}

#####################################
########## SECURITY GROUPS ##########
#####################################

# Create a security group for the ECS service
resource "aws_security_group" "ecs_sg" {
  name        = "ecs-sg"
  description = "Security group for ECS service"

  vpc_id = aws_vpc.fr_vpc.id

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

  vpc_id = aws_vpc.fr_vpc.id

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

  lifecycle {
    ignore_changes = [ ingress ]
  }
}