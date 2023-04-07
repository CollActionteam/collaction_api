resource "azurerm_container_registry" "collaction" {
  name                = "collaction"
  resource_group_name = azurerm_resource_group.collaction_api.name
  location            = azurerm_resource_group.collaction_api.location
  sku                 = "Standard"
  admin_enabled       = true
}
