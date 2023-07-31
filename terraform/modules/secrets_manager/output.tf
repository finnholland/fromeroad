output "ssm_arn" {
  value = data.aws_secretsmanager_secret.fr_secrets.arn
}