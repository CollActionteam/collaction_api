variable "workspace_id" {
  type        = string
  description = "Azure Log Analytics Workspace ID"
}

variable "workspace_key" {
  type        = string
  description = "Azure Log Analytics Workspace Key"
}

variable "az_registry_username" {
  type        = string
  description = "Azure Container Registry username"
}

variable "az_registry_password" {
  type        = string
  description = "Azure Container Registry password"
}

variable "az_registry_url" {
  type        = string
  description = "Azure Container Registry URL"
}