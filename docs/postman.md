Postman/API notes

This project does not currently expose an HTTP API. If you plan to wrap it with a lightweight REST service, below are suggested endpoints and example Postman request snippets. These assume a simple express server layer that delegates to a singleton CheckOutImpl instance identified by a cart id.

Suggested endpoints
- POST /carts -> { id }
- POST /carts/{id}/scan { sku: "atv" }
- POST /carts/{id}/total -> { total: 123.45 }
- GET /inventory/{sku} -> { sku, on_hand }
- GET /prices/{sku} -> { sku, price }

Postman examples (raw body JSON)
- Create cart
  POST {{baseUrl}}/carts
  Body: {}

- Scan item
  POST {{baseUrl}}/carts/{{cartId}}/scan
  Body: { "sku": "ipd" }

- Get total
  POST {{baseUrl}}/carts/{{cartId}}/total
  Body: {}

- Get inventory for SKU
  GET {{baseUrl}}/inventory/ipd

- Get price for SKU
  GET {{baseUrl}}/prices/ipd

Collection skeleton (v2.1)
{
  "info": {
    "name": "Checkout API",
    "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
  },
  "item": [
    {"name": "Create cart", "request": {"method": "POST", "url": "{{baseUrl}}/carts", "body": {"mode": "raw", "raw": "{}"}}},
    {"name": "Scan item", "request": {"method": "POST", "url": "{{baseUrl}}/carts/{{cartId}}/scan", "body": {"mode": "raw", "raw": "{\n  \"sku\": \"atv\"\n}"}}},
    {"name": "Get total", "request": {"method": "POST", "url": "{{baseUrl}}/carts/{{cartId}}/total"}},
    {"name": "Get inventory", "request": {"method": "GET", "url": "{{baseUrl}}/inventory/{{sku}}"}},
    {"name": "Get price", "request": {"method": "GET", "url": "{{baseUrl}}/prices/{{sku}}"}}
  ]
}
