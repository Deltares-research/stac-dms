resource "aws_secretsmanager_secret" "harbor_credentials" {
  name                    = "harbor-credentials-${terraform.workspace}"
  recovery_window_in_days = 0
}

resource "aws_secretsmanager_secret_version" "harbor_credentials" {
  secret_id = aws_secretsmanager_secret.harbor_credentials.id
  secret_string = jsonencode({
    username = var.harbor_username
    password = var.harbor_password
  })
}

resource "aws_secretsmanager_secret" "azure_app_credentials" {
  name                    = "azure-app-credentials-${terraform.workspace}"
  recovery_window_in_days = 0
}

resource "aws_secretsmanager_secret_version" "azure_app_credentials" {
  secret_id = aws_secretsmanager_secret.azure_app_credentials.id
  secret_string = jsonencode({
    azure_app_client_secret = var.azure_app_client_secret
    azure_app_client_id     = var.azure_app_client_id
    azure_app_tenant_id     = var.azure_app_tenant_id
  })
}

resource "aws_secretsmanager_secret" "backend_secret_key" {
  name                    = "backend-secret-key-${terraform.workspace}"
  recovery_window_in_days = 0
}

resource "aws_secretsmanager_secret_version" "backend_secret_key" {
  secret_id = aws_secretsmanager_secret.backend_secret_key.id
  secret_string = jsonencode({
    app_secret_key = var.app_secret_key
  })
}
