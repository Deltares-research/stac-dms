
resource "aws_vpc" "vpc" {
  enable_dns_hostnames = true
  cidr_block           = "172.31.0.0/16"
  tags = {
    Name = "VPC ${terraform.workspace}"
  }
}

resource "aws_subnet" "az1a" {
  availability_zone = "eu-west-1a"
  vpc_id            = aws_vpc.vpc.id
  cidr_block        = "172.31.16.0/20"
  tags = {
    Name = "${terraform.workspace} subnet for eu-west-1a"
  }
}

resource "aws_subnet" "az1b" {
  availability_zone = "eu-west-1b"
  vpc_id            = aws_vpc.vpc.id
  cidr_block        = "172.31.0.0/20"
  tags = {
    Name = "${terraform.workspace} subnet for eu-west-1b"
  }
}

resource "aws_subnet" "az1c" {
  availability_zone = "eu-west-1c"
  vpc_id            = aws_vpc.vpc.id
  cidr_block        = "172.31.32.0/20"
  tags = {
    Name = "${terraform.workspace} subnet for eu-west-1c"
  }
}

resource "aws_internet_gateway" "vpc" {
  vpc_id = aws_vpc.vpc.id
}

resource "aws_route" "igw" {
  route_table_id         = aws_vpc.vpc.main_route_table_id
  destination_cidr_block = "0.0.0.0/0"
  gateway_id             = aws_internet_gateway.vpc.id
}


resource "aws_security_group" "default" {
  vpc_id = aws_vpc.vpc.id

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
}

resource "aws_security_group" "task" {
  vpc_id      = aws_vpc.vpc.id
  name        = "dms-task-sg-${terraform.workspace}"
  description = "Security group for dms task containers, allow all outbound traffic and traffic to the EFS security group"
}

resource "aws_vpc_security_group_egress_rule" "allow_all_traffic_ipv4_task" {
  security_group_id = aws_security_group.task.id
  cidr_ipv4         = "0.0.0.0/0"
  ip_protocol       = "-1" # semantically equivalent to all ports
}