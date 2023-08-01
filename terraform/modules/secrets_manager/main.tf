data "aws_secretsmanager_secret" "fr_secrets" {
  name = "fr/${var.env}/secrets"
}