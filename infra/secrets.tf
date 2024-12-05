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

resource "aws_secretsmanager_secret" "azure_app_client_secret" {
  name = "azure-app-client-secret-${terraform.workspace}"
}

resource "aws_secretsmanager_secret_version" "azure_app_client_secret" {
  secret_id = aws_secretsmanager_secret.azure_app_client_secret.id
  secret_string = jsonencode({
    azure_app_client_secret = var.azure_app_client_secret
  })
}

resource "aws_secretsmanager_secret" "azure_app_client_id" {
  name = "azure-app-client-id-${terraform.workspace}"
}

resource "aws_secretsmanager_secret_version" "azure_app_client_id" {
  secret_id = aws_secretsmanager_secret.azure_app_client_id.id
  secret_string = jsonencode({
    azure_app_client_id = var.azure_app_client_id
  })
}

resource "aws_secretsmanager_secret" "azure_app_tenant_id" {
  name = "azure-app-tenant-id-${terraform.workspace}"
}

resource "aws_secretsmanager_secret_version" "azure_app_tenant_id" {
  secret_id = aws_secretsmanager_secret.azure_app_tenant_id.id
  secret_string = jsonencode({
    azure_app_tenant_id = var.azure_app_tenant_id
  })
}

resource "aws_secretsmanager_secret" "app_secret_key" {
  name = "app-secret-key-${terraform.workspace}"
}

resource "aws_secretsmanager_secret_version" "app_secret_key" {
  secret_id = aws_secretsmanager_secret.app_secret_key.id
  secret_string = jsonencode({
    app_secret_key = var.app_secret_key
  })
}