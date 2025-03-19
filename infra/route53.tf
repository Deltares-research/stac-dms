data "aws_route53_zone" "opensearch" {
  name = "deltares-fairdata.com"
}

data "aws_acm_certificate" "opensearch" {
  domain = "deltares-fairdata.com"
}

data "aws_acm_certificate" "non_prod_domain" {
  domain = "*.deltares-fairdata.com"
}

locals {
  # For prod workspace, use the top-level domain
  # For other workspaces, use a subdomain based on the workspace name
  domain_name = terraform.workspace == "prod" ? "deltares-fairdata.com" : "${terraform.workspace}.deltares-fairdata.com"
}

# Create DNS records for the frontend application
resource "aws_route53_record" "frontend" {
  zone_id = data.aws_route53_zone.opensearch.zone_id
  name    = local.domain_name
  type    = "A"

  alias {
    name                   = aws_lb.ecs_alb.dns_name
    zone_id                = aws_lb.ecs_alb.zone_id
    evaluate_target_health = true
  }
}
