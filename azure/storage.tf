# resource "azurerm_storage_account" "collaction" {
#   name                     = "collaction"
#   location                 = azurerm_resource_group.collaction_api.location
#   resource_group_name      = azurerm_resource_group.collaction_api.name
#   account_tier             = "Standard"
#   account_replication_type = "LRS"
# }
# 
# resource "azurerm_storage_container" "collaction_api_dev" {
#   name                  = "collaction-api-dev"
#   storage_account_name  = azurerm_storage_account.collaction.name
#   container_access_type = "blob"
# }
# 
# resource "azurerm_storage_container" "collaction_api_production" {
#   name                  = "collaction-api-production"
#   storage_account_name  = azurerm_storage_account.collaction.name
#   container_access_type = "blob"
# }


resource "azurerm_storage_account" "collaction_static_dev" {
  name                     = "collaction-static-dev"
  location                 = azurerm_resource_group.collaction_api.location
  resource_group_name      = azurerm_resource_group.collaction_api.name
  account_tier             = "Standard"
  account_replication_type = "LRS"
}

resource "azurerm_storage_container" "collaction_static_dev" {
  name                  = "$web"
  storage_account_name  = azurerm_storage_account.collaction_static_dev.name
  container_access_type = "blob"
}

resource "azurerm_storage_account" "collaction_static_production" {
  name                     = "collaction-static-production"
  location                 = azurerm_resource_group.collaction_api.location
  resource_group_name      = azurerm_resource_group.collaction_api.name
  account_tier             = "Standard"
  account_replication_type = "LRS"
}

resource "azurerm_storage_container" "collaction_static_production" {
  name                  = "$web"
  storage_account_name  = azurerm_storage_account.collaction_static_production.name
  container_access_type = "blob"
}
