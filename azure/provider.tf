terraform {
  required_providers {
    azurerm = {
      source  = "hashicorp/azurerm"
      version = "3.35.0"
    }
  }

  cloud {
    organization = "collaction"
    workspaces {
      name = "collaction_api"
    }
  }
}

provider "azurerm" {
  features {}
}
