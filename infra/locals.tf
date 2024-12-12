data "aws_caller_identity" "current_account" {}

locals {
  is_prod = terraform.workspace == "prod" ? true : false
  default_tags = {
    "terraform"   = "true"
    "project"     = "dms"
    "environment" = terraform.workspace
  }

  aws_account_id = data.aws_caller_identity.current_account.account_id
  domain         = "dms-engine-${terraform.workspace}"
  custom_domain  = data.aws_route53_zone.opensearch.name
  master_user    = "dms-masteruser"
}