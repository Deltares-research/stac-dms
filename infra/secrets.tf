resource "aws_secretsmanager_secret" "harbor_login" {
  name = "harbor-login-${terraform.workspace}"
}

resource "aws_secretsmanager_secret_version" "harbor_login" {
  secret_id = aws_secretsmanager_secret.harbor_login.id
  secret_string = jsonencode({
    username = var.harbor_username
    password = var.harbor_password
  })
}