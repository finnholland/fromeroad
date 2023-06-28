
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
  master_username    = "${var.RDS_USER}"
  master_password    = var.RDS_PASSWORD
  copy_tags_to_snapshot = true
  network_type = "IPV4"
  skip_final_snapshot = true
  storage_encrypted = true
  port = 3306
  db_subnet_group_name = var.subn_group_name
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
  vpc_security_group_ids = [var.rds_sg_id]
}