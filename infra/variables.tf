variable "aws_region" {
  type    = string
  default = "eu-west-1"
}
variable "security_options_enabled" {
  type    = bool
  default = false
}
variable "volume_type" {
  type    = string
  default = "gp3"
}
variable "throughput" {
  type    = number
  default = 125
}
variable "ebs_enabled" {
  type    = bool
  default = true
}
variable "ebs_volume_size" {
  type    = number
  default = 10
}
variable "instance_type" {
  type    = string
  default = "t3.small.search"
}
variable "instance_count" {
  type    = number
  default = 1
}
variable "dedicated_master_enabled" {
  type    = bool
  default = false
}
variable "dedicated_master_count" {
  type    = number
  default = 1
}
variable "dedicated_master_type" {
  type    = string
  default = "t3.small.search"
}
variable "zone_awareness_enabled" {
  type    = bool
  default = false
}
variable "engine_version" {
  type    = string
  default = "2.15"
}
variable "harbor_url" {
  default = "containers.deltares.nl"
  type    = string
}

variable "harbor_project" {
  default = "fair-data"
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
