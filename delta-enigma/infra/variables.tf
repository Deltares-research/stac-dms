variable "aws_region" {
  type    = string
  default = "eu-west-1"
}

variable "harbor_url" {
  default = "containers.deltares.nl"
  type    = string
}

variable "harbor_project" {
  default = "delta-enigma"
  type    = string
}

variable "harbor_username" {
  type      = string
  sensitive = false
}

variable "harbor_password" {
  type      = string
  sensitive = true
}

variable "certificate_arn" {
  default = "arn:aws:acm:eu-west-1:654654181948:certificate/bc14494c-2be8-47c8-9ab4-e95e40b3d41f"
  type    = string
}

variable "azure_app_client_secret" {
  type      = string
  sensitive = true
}

variable "azure_app_client_id" {
  type      = string
  sensitive = true
}

variable "azure_app_tenant_id" {
  type      = string
  sensitive = true
}

variable "app_secret_key" {
  type      = string
  sensitive = true
}
