resource "aws_ecs_cluster" "cluster" {
  name = "dms-cluster-${terraform.workspace}"
  tags = local.default_tags
  setting {
    name  = "containerInsights"
    value = "enabled"
  }
}

resource "aws_ecs_cluster_capacity_providers" "cluster" {
  cluster_name = aws_ecs_cluster.cluster.name

  capacity_providers = ["FARGATE"]
}

# Role and policy for the ECS task execution
resource "aws_iam_role" "ecs_task_execution_role" {
  name               = "ecs-task-execution-role-${terraform.workspace}"
  assume_role_policy = data.aws_iam_policy_document.ecs_task_execution_role_assume_role_policy.json
}

data "aws_iam_policy_document" "ecs_task_execution_role_assume_role_policy" {
  statement {
    effect = "Allow"

    principals {
      type        = "Service"
      identifiers = ["ecs-tasks.amazonaws.com"]
    }

    actions = [
      "sts:AssumeRole",
    ]
  }
}

resource "aws_iam_role_policy_attachment" "ecs-task-execution-role-policy-attachment" {
  role       = aws_iam_role.ecs_task_execution_role.name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AmazonECSTaskExecutionRolePolicy"
}

resource "aws_iam_role_policy" "password_policy_secretsmanager" {
  name   = "dms-ecs-task-secretsmanager-${terraform.workspace}"
  role   = aws_iam_role.ecs_task_execution_role.id
  policy = data.aws_iam_policy_document.get_secrets_policy.json
}

data "aws_iam_policy_document" "get_secrets_policy" {
  statement {
    effect = "Allow"

    actions = [
      "secretsmanager:GetSecretValue",
    ]

    resources = [
      aws_secretsmanager_secret.harbor_login.arn
    ]
  }
}

resource "aws_iam_role_policy" "write_logs" {
  name   = "dms-ecs-task-write-logs-${terraform.workspace}"
  role   = aws_iam_role.ecs_task_execution_role.id
  policy = data.aws_iam_policy_document.write_logs.json
}

data "aws_iam_policy_document" "write_logs" {
  statement {
    effect = "Allow"

    actions = [
      "logs:CreateLogStream",
      "logs:PutLogEvents"
    ]

    resources = [
      aws_cloudwatch_log_group.ecs_log_group.arn
    ]
  }
}

# Role the task will assume
resource "aws_iam_role" "ecs_task_role" {
  name               = "ecs-task-role-${terraform.workspace}"
  assume_role_policy = data.aws_iam_policy_document.ecs_task_role_assume_role_policy.json
}

data "aws_iam_policy_document" "ecs_task_role_assume_role_policy" {
  statement {
    effect = "Allow"

    principals {
      type        = "Service"
      identifiers = ["ecs-tasks.amazonaws.com"]
    }

    actions = [
      "sts:AssumeRole",
    ]
  }
}

resource "aws_iam_role_policy_attachment" "task_s3_access" {
  role       = aws_iam_role.ecs_task_role.name
  policy_arn = "arn:aws:iam::aws:policy/AmazonS3FullAccess"
}

data "aws_iam_policy_document" "ecs_task_role_policy" {
  statement {
    effect = "Allow"
    actions = [
      "states:SendTaskSuccess",
    ]

    resources = ["*"]
  }
}

resource "aws_iam_role_policy" "ecs_task_role_policy" {
  role   = aws_iam_role.ecs_task_role.name
  policy = data.aws_iam_policy_document.ecs_task_role_policy.json
}
