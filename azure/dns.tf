resource "azurerm_dns_zone" "collaction_app" {
  name                = "collaction.app"
  resource_group_name = azurerm_resource_group.collaction_api.name
}

resource "azurerm_dns_a_record" "collaction_app_website" {
  name                = "@"
  zone_name           = azurerm_dns_zone.collaction_app.name
  resource_group_name = azurerm_resource_group.collaction_api.name
  ttl                 = 300
  # Website hosted on Vercel
  records = ["76.76.21.21"]
}

resource "azurerm_dns_cname_record" "collaction_app_www" {
  name                = "www"
  zone_name           = azurerm_dns_zone.collaction_app.name
  resource_group_name = azurerm_resource_group.collaction_api.name
  ttl                 = 300
  record              = "cname.vercel-dns.com"
}

resource "azurerm_dns_zone" "collaction_org" {
  name                = "collaction.org"
  resource_group_name = azurerm_resource_group.collaction_api.name
}

resource "azurerm_dns_a_record" "collaction_org_website" {
  name                = "@"
  zone_name           = azurerm_dns_zone.collaction_org.name
  resource_group_name = azurerm_resource_group.collaction_api.name
  ttl                 = 300
  # Website hosted on Vercel
  records = ["76.76.21.21"]
}

resource "azurerm_dns_mx_record" "collaction_org" {
  name                = "@"
  zone_name           = azurerm_dns_zone.collaction_org.name
  resource_group_name = azurerm_resource_group.collaction_api.name
  ttl                 = 300

  record {
    preference = 1
    exchange   = "ASPMX.L.GOOGLE.COM."
  }

  record {
    preference = 5
    exchange   = "ALT1.ASPMX.L.GOOGLE.COM."
  }

  record {
    preference = 5
    exchange   = "ALT2.ASPMX.L.GOOGLE.COM."
  }

  record {
    preference = 10
    exchange   = "ALT3.ASPMX.L.GOOGLE.COM."
  }

  record {
    preference = 10
    exchange   = "ALT4.ASPMX.L.GOOGLE.COM."
  }

  record {
    preference = 10
    exchange   = "x3hzrrc76ur7ql23dtzahto3xlxu2tyrgsgosvkpxf5cry4yhffq.mx-verification.google.com."
  }
}

resource "azurerm_dns_txt_record" "google-site-verification" {
  name                = "@"
  zone_name           = azurerm_dns_zone.collaction_org.name
  resource_group_name = azurerm_resource_group.collaction_api.name
  ttl                 = 300

  record {
    value = "\"google-site-verification=SW8ISEH0mS7aKfOnxzUEjgMyrNyNDX1CkWrc6OBV5Js\""
  }

  record {
    value = "\"google-site-verification=TyCEpqnZwyWaRL1FhYY46fr7faAfDbCP16AOQwQVElw\""
  }

  record {
    value = "\"google-site-verification=Kh1C6nh-U5B6efQFVrwGbD65rs53Ubr_14jiWqiAP9k\""
  }

  record {
    value = "\"MS=ms78684470\""
  }
}

# TODO(gm): Connect these to containers
# resource "azurerm_dns_cname_record" "api-production" {
#   name                = "api"
#   zone_name           = azurerm_dns_zone.collaction_org.name
#   resource_group_name = azurerm_resource_group.collaction_api.name
#   ttl                 = 300
#   record              = "collaction-api-prod-1123994322.eu-central-1.elb.amazonaws.com."
# }
# 
# resource "azurerm_dns_cname_record" "api-dev" {
#   name                = "devapi"
#   zone_name           = azurerm_dns_zone.collaction_org.name
#   resource_group_name = azurerm_resource_group.collaction_api.name
#   ttl                 = 300
#   record              = "collaction-api-dev-183571204.eu-central-1.elb.amazonaws.com."
# }

resource "azurerm_dns_cname_record" "docs" {
  name                = "docs"
  zone_name           = azurerm_dns_zone.collaction_org.name
  resource_group_name = azurerm_resource_group.collaction_api.name
  ttl                 = 300
  record              = "19caebbc41-hosting.gitbook.io"
}

# TODO(gm): how to connect this to Azure Blob Storage?
# resource "azurerm_dns_a_record" "static-dev" {
#   name = "static-dev"
#   zone_name = azurerm_dns_zone.collaction_org.name
#   resource_group_name = azurerm_resource_group.collaction_api.name
#   ttl = 300
#   records = [""]
# }

# resource "azurerm_dns_a_record" "static-production" {
#   name = "static"
#   zone_name = azurerm_dns_zone.collaction_org.name
#   resource_group_name = azurerm_resource_group.collaction_api.name
#   ttl = 300
#   records = [""]
# }

resource "azurerm_dns_cname_record" "collaction_org_www" {
  name                = "www"
  zone_name           = azurerm_dns_zone.collaction_org.name
  resource_group_name = azurerm_resource_group.collaction_api.name
  ttl                 = 300
  record              = "cname.vercel-dns.com"
}
