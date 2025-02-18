data "aws_route53_zone" "opensearch" {
  name = "deltares-fairdata.com"
}
data "aws_acm_certificate" "opensearch" {
  domain = "deltares-fairdata.com"
}