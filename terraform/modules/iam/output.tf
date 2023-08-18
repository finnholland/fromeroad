output "S3_KEY" {
  value = aws_iam_access_key.S3_KEY
}
output "SES_KEY" {
  value = aws_iam_access_key.SES_KEY
}
output "S3_SECRET" {
  value = aws_iam_access_key.S3_KEY.secret
}
output "SES_SECRET" {
  value = aws_iam_access_key.SES_KEY.secret
}
output "ecs_task_execution_role" {
  value = aws_iam_role.ecsTaskExecutionRole.arn
}