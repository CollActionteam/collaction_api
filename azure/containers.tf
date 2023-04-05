resource "azurerm_container_group" "collaction_api_development" {
  name                = "collaction_api_development"
  location            = azurerm_resource_group.collaction_api.location
  resource_group_name = azurerm_resource_group.collaction_api.name
  ip_address_type     = "Public"
  dns_name_label      = "development-api"
  os_type             = "Linux"

  diagnostics {
    log_analytics {
      workspace_id = var.workspace_id
      workspace_key = var.workspace_key
    }
  }

  image_registry_credential {
    username = var.az_registry_username
    password = var.az_registry_password
    server   = var.az_registry_url
  }

  container {
    name = "backend"
    image  = "collaction.azurecr.io/collaction-api-development:development"
    cpu    = "1.0"
    memory = "1.5"

    ports {
      port     = 80
      protocol = "TCP"
    }

    ports {
      port     = 443
      protocol = "TCP"
    }
  }

  tags = {
    environment = "development"
  }
}

resource "azurerm_container_group" "collaction_api_production" {
  name                = "collaction_api_production"
  location            = azurerm_resource_group.collaction_api.location
  resource_group_name = azurerm_resource_group.collaction_api.name
  ip_address_type     = "Public"
  dns_name_label      = "production-api"
  os_type             = "Linux"

  diagnostics {
    log_analytics {
      workspace_id = var.workspace_id
      workspace_key = var.workspace_key
    }
  }

  image_registry_credential {
    username = var.az_registry_username
    password = var.az_registry_password
    server   = var.az_registry_url
  }

  container {
    name = "backend"
    image  = "collaction.azurecr.io/collaction-api-production:production"
    cpu    = "1.0"
    memory = "1.5"

    ports {
      port     = 80
      protocol = "TCP"
    }

    ports {
      port     = 443
      protocol = "TCP"
    }
  }

  tags = {
    environment = "production"
  }
}