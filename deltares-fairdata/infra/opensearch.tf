resource "aws_security_group" "opensearch_sg" {
  name        = "dms-es-sg-${terraform.workspace}"
  vpc_id      = aws_vpc.vpc.id
  description = "Allow inbound HTTPS traffic for opensearch"
}

resource "aws_vpc_security_group_ingress_rule" "opensearch_sg_ingress" {
  security_group_id            = aws_security_group.opensearch_sg.id
  from_port                    = 443
  to_port                      = 443
  ip_protocol                  = "tcp"
  referenced_security_group_id = aws_security_group.backend-ecs.id
}


resource "random_password" "os_password" {
  length  = 24
  special = true
}

resource "aws_secretsmanager_secret" "opensearch_credentials" {
  name                    = "opensearch-creds-${terraform.workspace}"
  recovery_window_in_days = 0
}

resource "aws_secretsmanager_secret_version" "opensearch_credentials" {
  secret_id = aws_secretsmanager_secret.opensearch_credentials.id
  secret_string = jsonencode({
    username = local.master_user,
    password = random_password.os_password.result
  })
}

resource "aws_opensearch_domain" "opensearch" {
  domain_name    = local.domain
  engine_version = "OpenSearch_2.15"

  cluster_config {
    dedicated_master_count   = 1
    dedicated_master_type    = "t3.small.search"
    dedicated_master_enabled = false
    instance_type            = "t3.small.search"
    instance_count           = 2
    zone_awareness_enabled   = false
  }
  ebs_options {
    ebs_enabled = true
    volume_size = 30
    volume_type = "gp3"
    throughput  = 125
  }
  advanced_security_options {
    enabled                        = true
    anonymous_auth_enabled         = false
    internal_user_database_enabled = true
    master_user_options {
      master_user_name     = local.master_user
      master_user_password = random_password.os_password.result
    }
  }

  encrypt_at_rest {
    enabled = true
  }

  domain_endpoint_options {
    enforce_https       = true
    tls_security_policy = "Policy-Min-TLS-1-2-2019-07"

    custom_endpoint_enabled = false
    # custom_endpoint                 = local.custom_domain
    # custom_endpoint_certificate_arn = data.aws_acm_certificate.opensearch.arn
  }



  log_publishing_options {
    cloudwatch_log_group_arn = aws_cloudwatch_log_group.opensearch_log_group_index_slow_logs.arn
    log_type                 = "INDEX_SLOW_LOGS"
  }
  log_publishing_options {
    cloudwatch_log_group_arn = aws_cloudwatch_log_group.opensearch_log_group_search_slow_logs.arn
    log_type                 = "SEARCH_SLOW_LOGS"
  }
  log_publishing_options {
    cloudwatch_log_group_arn = aws_cloudwatch_log_group.opensearch_log_group_es_application_logs.arn
    log_type                 = "ES_APPLICATION_LOGS"
  }

  node_to_node_encryption {
    enabled = true
  }

  vpc_options {
    subnet_ids = slice([aws_subnet.az1a.id, aws_subnet.az1b.id, aws_subnet.az1c.id], 0, 1)

    security_group_ids = [aws_security_group.opensearch_sg.id]
  }


  access_policies = <<CONFIG
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Action": "es:*",
            "Principal": "*",
            "Effect": "Allow",
            "Resource": "arn:aws:es:${var.aws_region}:${local.aws_account_id}:domain/${local.domain}/*"
        },
        {
            "Action": "*",
            "Principal": "*",
            "Effect": "Allow",
            "Resource": "*"
        }
    ]
}
CONFIG
}
