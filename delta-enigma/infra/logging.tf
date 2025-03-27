data "aws_iam_policy_document" "elasticsearch-log-publishing-policy" {
  statement {
    actions = [
      "logs:CreateLogStream",
      "logs:PutLogEvents",
      "logs:PutLogEventsBatch",
    ]

    resources = ["arn:aws:logs:*"]

    principals {
      identifiers = ["es.amazonaws.com"]
      type        = "Service"
    }
  }
}

resource "aws_cloudwatch_log_resource_policy" "elasticsearch-log-publishing-policy" {
  policy_document = data.aws_iam_policy_document.elasticsearch-log-publishing-policy.json
  policy_name     = "elasticsearch-log-publishing-policy"
}

# Create a Log group for opensearch
resource "aws_cloudwatch_log_group" "opensearch_log_group_index_slow_logs" {
  depends_on        = [aws_kms_key.log_group_key]
  name_prefix       = "/aws/es/${terraform.workspace}"
  retention_in_days = 1
  kms_key_id        = aws_kms_key.log_group_key.arn

}

# Create a Log group for opensearch
resource "aws_cloudwatch_log_group" "opensearch_log_group_search_slow_logs" {
  depends_on        = [aws_kms_key.log_group_key]
  name_prefix       = "/aws/es/${terraform.workspace}"
  retention_in_days = 1
  kms_key_id        = aws_kms_key.log_group_key.arn
}

# Create a Log group for opensearch
resource "aws_cloudwatch_log_group" "opensearch_log_group_es_application_logs" {
  depends_on        = [aws_kms_key.log_group_key]
  name_prefix       = "/aws/es/${terraform.workspace}"
  retention_in_days = 1
  kms_key_id        = aws_kms_key.log_group_key.arn
}

# Create a Log group for ecs
resource "aws_cloudwatch_log_group" "ecs_log_group" {
  depends_on        = [aws_kms_key.log_group_key]
  name_prefix       = "/aws/vendedlogs/states/ecs-${terraform.workspace}-"
  retention_in_days = 1
  kms_key_id        = aws_kms_key.log_group_key.arn
}

resource "aws_kms_key" "log_group_key" {
}

resource "aws_kms_key_policy" "log_group_key_policy" {
  key_id = aws_kms_key.log_group_key.id
  policy = jsonencode({
    Id = "log_group_key_policy_${terraform.workspace}"
    Statement = [
      {
        Action = "kms:*"
        Effect = "Allow"
        Principal = {
          AWS = "arn:aws:iam::${data.aws_caller_identity.current_account.account_id}:root"
        }

        Resource = "*"
        Sid      = "Enable IAM User Permissions"
      },
      {
        Effect = "Allow",
        Principal = {
          Service : "logs.${var.aws_region}.amazonaws.com"
        },
        Action = [
          "kms:Encrypt*",
          "kms:Decrypt*",
          "kms:ReEncrypt*",
          "kms:GenerateDataKey*",
          "kms:Describe*"
        ],
        Resource = "*"
      }
    ]
    Version = "2012-10-17"
  })
}
