provider "aws" {
  region = var.region
}

# Create a Cognito User Pool
resource "aws_cognito_user_pool" "user_pool" {
  name                = "${var.app_name}-user-pool"
  auto_verified_attributes = ["email"]
  
  password_policy {
    minimum_length    = 8
    require_uppercase = true
    require_lowercase = true
    require_numbers   = true
    # Change this based on your requirements
    require_symbols   = false
  }

  mfa_configuration = "ON"
}

# Create a Cognito User Pool Client
resource "aws_cognito_user_pool_client" "user_pool_client" {
  name         = "${var.app_name}-client"
  user_pool_id = aws_cognito_user_pool.user_pool.id

  explicit_auth_flows = ["ALLOW_USER_PASSWORD_AUTH", "ALLOW_REFRESH_TOKEN_AUTH"]
  generate_secret      = false
}

# Create IAM role for Amplify
resource "aws_iam_role" "amplify_role" {
  name               = "${var.app_name}-amplify-role"
  assume_role_policy = data.aws_iam_policy_document.amplify_assume_role_policy.json
}

# Attach necessary permissions to the Amplify role
resource "aws_iam_role_policy_attachment" "amplify_policy_attachment" {
  policy_arn = aws_iam_policy.amplify_policy.arn
  role       = aws_iam_role.amplify_role.name
}

# Define a policy for the Amplify app
resource "aws_iam_policy" "amplify_policy" {
  name        = "${var.app_name}-policy"
  description = "IAM policy for Amplify app"

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Action = [
          "cognito:*",
          "dynamodb:*",
          # Add other actions as necessary
        ]
        Resource = "*"
      }
    ]
  })
}

# Create an Amplify App
resource "aws_amplify_app" "amplify_app" {
  name = var.app_name
  repository = var.repository_url
  oauth_token = var.github_token # Ensure this is securely stored

  environment_variables = {
    "AWS_COGNITO_USER_POOL_ID"     = aws_cognito_user_pool.user_pool.id
    "AWS_COGNITO_USER_POOL_CLIENT_ID" = aws_cognito_user_pool_client.user_pool_client.id
  }
}

# Output the user pool and app URLs
output "user_pool_id" {
  value = aws_cognito_user_pool.user_pool.id
}

output "amplify_app_url" {
  value = aws_amplify_app.amplify_app.default_domain
}

