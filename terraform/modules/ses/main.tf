resource "aws_ses_domain_identity" "fr_ses" {
  domain = "fromeroad.com"
}

resource "aws_ses_domain_dkim" "fr_ses_dkim" {
  domain = aws_ses_domain_identity.fr_ses.domain
}