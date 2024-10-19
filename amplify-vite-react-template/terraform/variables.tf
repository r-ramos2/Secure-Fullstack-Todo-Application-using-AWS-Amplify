variable "app_name" {
  description = "The name of the application"
  type        = string
}

variable "region" {
  description = "The AWS region to deploy the resources"
  type        = string
  default     = "us-east-1"
}

variable "repository_url" {
  description = "GitHub repository URL for the Amplify app"
  type        = string
}

variable "github_token" {
  description = "GitHub personal access token for Amplify"
  type        = string
  sensitive   = true
}

