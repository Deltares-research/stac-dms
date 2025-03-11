resource "aws_db_instance" "dms" {
  identifier_prefix      = "dms-db-${terraform.workspace}"
  allocated_storage      = 20
  max_allocated_storage  = 100
  db_name                = "postgres_dms_${terraform.workspace}"
  engine                 = "postgres"
  engine_version         = "16.4"
  instance_class         = "db.t3.micro"
  username               = "dms"
  password               = random_password.db_password.result
  vpc_security_group_ids = [aws_security_group.dms-db.id]
  db_subnet_group_name   = aws_db_subnet_group.dms.name
  publicly_accessible    = false
  storage_type           = "gp2"
  skip_final_snapshot    = true
  multi_az               = false

}

resource "random_password" "db_password" {
  length  = 24
  special = false
}

resource "aws_secretsmanager_secret" "postgresql_credentials" {
  name                    = "dms-postgresql-credentials-${terraform.workspace}"
  recovery_window_in_days = 0
}

resource "aws_secretsmanager_secret_version" "postgresql_credentials" {
  secret_id = aws_secretsmanager_secret.postgresql_credentials.id
  secret_string = jsonencode({
    username = aws_db_instance.dms.username,
    password = random_password.db_password.result
  })
}

resource "aws_security_group" "dms-db" {
  name   = "dms-db-sg-${terraform.workspace}"
  vpc_id = aws_vpc.vpc.id

  ingress {
    from_port       = 5432
    to_port         = 5432
    protocol        = "tcp"
    security_groups = [aws_security_group.dms-ecs.id]
    description     = "Allow requests from dms-ecs"
  }

  ingress {
    from_port   = 5432
    to_port     = 5432
    protocol    = "tcp"
    cidr_blocks = [aws_vpc.vpc.cidr_block]
    description = "Allow requests from VPC"
  }
}

resource "aws_db_subnet_group" "dms" {
  name       = "postgres-dms-sn-group-${terraform.workspace}"
  subnet_ids = [aws_subnet.az1a.id, aws_subnet.az1b.id, aws_subnet.az1c.id]

  tags = {
    Name = "DB subnet group for dms database"
  }
}
