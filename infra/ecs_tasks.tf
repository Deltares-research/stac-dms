resource "aws_security_group" "dms-ecs" {
  name   = "dms-ecs-sg-${terraform.workspace}"
  vpc_id = aws_vpc.vpc.id

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
}

resource "aws_ecs_task_definition" "frontend" {
  family                   = "dms-frontend-${terraform.workspace}"
  requires_compatibilities = ["FARGATE"]
  cpu                      = 1024
  memory                   = 2048
  network_mode             = "awsvpc"
  execution_role_arn       = aws_iam_role.ecs_task_execution_role.arn
  task_role_arn            = aws_iam_role.ecs_task_role.arn

  container_definitions = jsonencode([
    {
      name  = "frontend"
      image = "${var.harbor_url}/${var.harbor_project}/frontend:${terraform.workspace}"
      repositoryCredentials = {
        credentialsParameter = aws_secretsmanager_secret.harbor_credentials.arn
      }
      cpu       = 1024
      memory    = 2048
      essential = true
      portMappings = [
        {
          containerPort = 3000
          hostPort      = 3000
          protocol      = "tcp"
        }
      ]
      logConfiguration = {
        logDriver = "awslogs"
        options = {
          awslogs-group         = aws_cloudwatch_log_group.ecs_log_group.name
          awslogs-region        = var.aws_region
          awslogs-stream-prefix = "ecs-frontend"
        }
      }
    }
  ])
}

resource "aws_ecs_service" "frontend_service" {
  name            = "frontend-service"
  cluster         = aws_ecs_cluster.cluster.name
  task_definition = aws_ecs_task_definition.frontend.arn
  desired_count   = 1
  launch_type     = "FARGATE"

  network_configuration {
    subnets          = ["${aws_subnet.az1a.id}", "${aws_subnet.az1b.id}", "${aws_subnet.az1c.id}"]
    security_groups  = ["${aws_security_group.frontend-ecs.id}"]
    assign_public_ip = true
  }
  load_balancer {
    target_group_arn = aws_lb_target_group.ecs_tg.arn
    container_name   = "frontend"
    container_port   = 3000
  }
}

resource "aws_security_group" "frontend-ecs" {
  name   = "frontend-ecs-sg-${terraform.workspace}"
  vpc_id = aws_vpc.vpc.id

  ingress {
    from_port       = 3000
    to_port         = 3000
    protocol        = "tcp"
    security_groups = [aws_security_group.frontend-alb.id]
    description     = "Allow traffic from ALB to frontend container"
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
    description = "Allow all outbound traffic"
  }
}

resource "aws_security_group" "frontend-alb" {
  name   = "frontend-alb-sg-${terraform.workspace}"
  vpc_id = aws_vpc.vpc.id

  ingress {
    from_port   = 443
    to_port     = 443
    protocol    = "tcp"
    self        = "false"
    cidr_blocks = ["0.0.0.0/0"]
    description = "Allow HTTP traffic"
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
    description = "Allow all outbound traffic"
  }
}

resource "aws_lb" "ecs_alb" {
  name               = "ecs-alb-${terraform.workspace}"
  internal           = false
  load_balancer_type = "application"
  security_groups    = [aws_security_group.frontend-alb.id]
  subnets            = [aws_subnet.az1a.id, aws_subnet.az1b.id, aws_subnet.az1c.id]

  tags = {
    Name = "ecs-alb"
  }
}

resource "aws_lb_listener" "ecs_alb_listener" {
  load_balancer_arn = aws_lb.ecs_alb.arn
  port              = 443
  protocol          = "HTTPS"
  ssl_policy        = "ELBSecurityPolicy-2016-08"
  certificate_arn   = var.certificate_arn

  default_action {
    type             = "forward"
    target_group_arn = aws_lb_target_group.ecs_tg.arn
  }

  lifecycle {
    replace_triggered_by = [aws_lb_target_group.ecs_tg]
  }
}

resource "aws_lb_listener_rule" "backend_routing" {
  listener_arn = aws_lb_listener.ecs_alb_listener.arn
  priority     = 100

  action {
    type             = "forward"
    target_group_arn = aws_lb_target_group.ecs_bg.arn
  }

  condition {
    path_pattern {
      values = ["/api/*"]
    }
  }
}

resource "aws_lb_target_group" "ecs_tg" {
  name        = "ecs-target-group-${terraform.workspace}"
  port        = 3000
  protocol    = "HTTP"
  target_type = "ip"
  vpc_id      = aws_vpc.vpc.id

  health_check {
    enabled             = true
    interval            = 30
    path                = "/"
    port                = "traffic-port"
    healthy_threshold   = 3
    unhealthy_threshold = 3
    timeout             = 5
    protocol            = "HTTP"
    matcher             = "200-399"
  }
}

resource "aws_ecs_task_definition" "backend" {
  family                   = "dms-backend-${terraform.workspace}"
  requires_compatibilities = ["FARGATE"]
  cpu                      = 1024
  memory                   = 2048
  network_mode             = "awsvpc"
  execution_role_arn       = aws_iam_role.ecs_task_execution_role.arn
  task_role_arn            = aws_iam_role.ecs_task_role.arn
  tags                     = {}
  container_definitions = jsonencode([
    {
      name  = "backend"
      image = "${var.harbor_url}/${var.harbor_project}/stac-fastapi-os:${terraform.workspace}"
      repositoryCredentials = {
        credentialsParameter = aws_secretsmanager_secret.harbor_credentials.arn
      }
      cpu       = 1024
      memory    = 2048
      essential = true
      portMappings = [
        {
          containerPort = 8000
          hostPort      = 8000
          protocol      = "tcp"
        }
      ]
      logConfiguration = {
        logDriver = "awslogs"
        options = {
          awslogs-group         = aws_cloudwatch_log_group.ecs_log_group.name
          awslogs-region        = var.aws_region
          awslogs-stream-prefix = "ecs-backend"
        }
      }
      environment = [
        {
          name  = "ES_PORT"
          value = "443"
        },
        {
          name  = "STAC_FASTAPI_DESCRIPTION"
          value = "A STAC API containing Deltares datasets"
        },
        {
          name  = "STAC_FASTAPI_TITLE"
          value = "Deltares Data Management Suite STAC API"
        },
        {
          name  = "ENVIRONMENT"
          value = "prod"
        },
        {
          name  = "ES_VERIFY_CERTS"
          value = "true"
        },
        {
          name  = "BACKEND"
          value = "opensearch"
        },
        {
          name  = "ES_USER"
          value = "${local.master_user}"
        },
        {
          name  = "ES_USE_SSL"
          value = "true"
        },
        {
          name  = "WEB_CONCURRENCY"
          value = "10"
        },
        {
          name  = "ES_HOST"
          value = "${aws_opensearch_domain.opensearch.endpoint}"
        },
        {
          name  = "STAC_FASTAPI_VERSION"
          value = "3.0.0a2"
        },
        {
          name  = "APP_HOST"
          value = "0.0.0.0"
        },
        {
          name  = "DB_CONNECTION_URL"
          value = "postgresql+psycopg://${aws_db_instance.dms.username}:${aws_db_instance.dms.password}@${aws_db_instance.dms.address}:${tostring(aws_db_instance.dms.port)}/postgres"
        },
        {
          name  = "APP_PORT"
          value = "8000"
        },
        {
          name  = "APP_DOMAIN"
          value = "${local.domain_name}"
        },
      ]
      secrets = [
        {
          name      = "AZURE_APP_CLIENT_SECRET"
          valueFrom = "${aws_secretsmanager_secret.azure_app_credentials.arn}:azure_app_client_secret::"
        },
        {
          name      = "AZURE_APP_CLIENT_ID"
          valueFrom = "${aws_secretsmanager_secret.azure_app_credentials.arn}:azure_app_client_id::"
        },
        {
          name      = "AZURE_TENANT_ID"
          valueFrom = "${aws_secretsmanager_secret.azure_app_credentials.arn}:azure_app_tenant_id::"
        },
        {
          name      = "APP_SECRET_KEY"
          valueFrom = "${aws_secretsmanager_secret.backend_secret_key.arn}:app_secret_key::"
        },
        {
          name      = "ES_PASS"
          valueFrom = "${aws_secretsmanager_secret.opensearch_credentials.arn}:password::"
        },
      ]
    }
  ])
}

resource "aws_security_group" "backend-ecs" {
  name   = "backend-ecs-sg-${terraform.workspace}"
  vpc_id = aws_vpc.vpc.id

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
    description = "Allow all outbound traffic"
  }
}

resource "aws_security_group" "backend-alb" {
  name   = "backend-alb-sg-${terraform.workspace}"
  vpc_id = aws_vpc.vpc.id

  ingress {
    from_port   = 443
    to_port     = 443
    protocol    = "tcp"
    self        = "false"
    cidr_blocks = ["0.0.0.0/0"]
    description = "Allow HTTP traffic"
  }

  egress {
    from_port       = 0
    to_port         = 0
    protocol        = "-1"
    security_groups = [aws_security_group.backend-ecs.id]
  }

}

resource "aws_lb_target_group" "ecs_bg" {
  name        = "ecs-target-group-backend-${terraform.workspace}"
  port        = 8000
  protocol    = "HTTP"
  target_type = "ip"
  vpc_id      = aws_vpc.vpc.id
}

resource "aws_ecs_service" "backend_service" {
  name            = "backend-service"
  cluster         = aws_ecs_cluster.cluster.name
  task_definition = aws_ecs_task_definition.backend.arn
  desired_count   = 1
  launch_type     = "FARGATE"

  network_configuration {
    subnets          = ["${aws_subnet.az1a.id}", "${aws_subnet.az1b.id}", "${aws_subnet.az1c.id}"]
    security_groups  = ["${aws_security_group.backend-ecs.id}"]
    assign_public_ip = true
  }
  load_balancer {
    target_group_arn = aws_lb_target_group.ecs_bg.arn
    container_name   = "backend"
    container_port   = 8000
  }
}
