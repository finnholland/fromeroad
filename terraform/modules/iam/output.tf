output "S3_KEY" {
  value = aws_iam_access_key.S3_KEY
}
output "SES_KEY" {
  value = aws_iam_access_key.SES_KEY
}
output "S3_SECRET" {
  value = aws_iam_access_key.S3_KEY.status
}
output "SES_SECRET" {
  value = aws_iam_access_key.SES_KEY.secret
}