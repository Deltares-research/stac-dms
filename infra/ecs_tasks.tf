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
      image = "${var.harbor_url}/${var.harbor_project}/frontend:latest"
      repositoryCredentials = {
        credentialsParameter = aws_secretsmanager_secret.harbor_login.arn
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
      # mountPoints = [
      #   {
      #     sourceVolume  = "task-storage"
      #     containerPath = "/dms-data"
      #     readOnly      = false
      #   }
      # ]
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
    security_groups  = ["${aws_security_group.dms-ecs.id}"]
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
    from_port       = 0
    to_port         = 0
    protocol        = "-1"
    security_groups = [aws_security_group.frontend-ecs.id]
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
}

resource "aws_ecs_task_definition" "backend" {
  family                   = "dms-backend-${terraform.workspace}"
  requires_compatibilities = ["FARGATE"]
  cpu                      = 1024
  memory                   = 2048
  network_mode             = "awsvpc"
  execution_role_arn       = aws_iam_role.ecs_task_execution_role.arn
  task_role_arn            = aws_iam_role.ecs_task_role.arn

  container_definitions = jsonencode([
    {
      name  = "backend"
      image = "${var.harbor_url}/${var.harbor_project}/stac-fastapi-os:latest"
      repositoryCredentials = {
        credentialsParameter = aws_secretsmanager_secret.harbor_login.arn
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
      # mountPoints = [
      #   {
      #     sourceVolume  = "task-storage"
      #     containerPath = "/dms-data"
      #     readOnly      = false
      #   }
      # ]
      logConfiguration = {
        logDriver = "awslogs"
        options = {
          awslogs-group         = aws_cloudwatch_log_group.ecs_log_group.name
          awslogs-region        = var.aws_region
          awslogs-stream-prefix = "ecs-backend"
        }
      }
    }
  ])
}

resource "aws_ecs_service" "backend_service" {
  name            = "backend-service"
  cluster         = aws_ecs_cluster.cluster.name
  task_definition = aws_ecs_task_definition.backend.arn
  desired_count   = 1
  launch_type     = "FARGATE"

  network_configuration {
    subnets          = ["${aws_subnet.az1a.id}", "${aws_subnet.az1b.id}", "${aws_subnet.az1c.id}"]
    security_groups  = ["${aws_security_group.dms-ecs.id}"]
    assign_public_ip = true
  }
  load_balancer {
    target_group_arn = aws_lb_target_group.ecs_bg.arn
    container_name   = "backend"
    container_port   = 8000
  }
}

resource "aws_security_group" "backend-ecs" {
  name   = "backend-ecs-sg-${terraform.workspace}"
  vpc_id = aws_vpc.vpc.id
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