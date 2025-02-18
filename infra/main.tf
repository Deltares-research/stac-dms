terraform {
  required_version = "~> 1.5.3"
}

resource "random_string" "random" {
  length  = 4
  special = false
}