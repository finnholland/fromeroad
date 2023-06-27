
# Create a Route 53 zone
resource "aws_route53_zone" "fromeroad" {
  name = "fromeroad.com"
  lifecycle {
    ignore_changes = [  ]
  }
  comment = "Fromeroad records"
}

# Create a DNS record in Route 53
resource "aws_route53_record" "fr_api_record" {
  zone_id = aws_route53_zone.fromeroad.id
  name    = "api.fromeroad.com"
  type    = "A"

  alias {
    name = var.lb_dns_name
    zone_id = var.lb_zone_id
    evaluate_target_health = true
  }
}