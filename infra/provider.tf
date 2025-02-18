terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "5.31.0"
    }
  }
  backend "s3" {
    bucket = "stac-dms-terraform-state"
    key    = "stac-dms.tfstate"
    region = "eu-west-1"
  }
}

provider "aws" {
  region = var.aws_region
  default_tags {
    tags = local.default_tags
  }
}