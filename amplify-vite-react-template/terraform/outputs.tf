output "cognito_user_pool_id" {
  description = "The ID of the Cognito User Pool"
  value       = aws_cognito_user_pool.user_pool.id
}

output "amplify_app_url" {
  description = "The URL of the deployed Amplify app"
  value       = aws_amplify_app.amplify_app.default_domain
}

