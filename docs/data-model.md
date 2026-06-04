Data model and schema

Domain objects
- Sku (src/model/sku.ts)
  - Enum values: ipd, mbp, atv, vga
  - Type alias SkuKeyType = keyof typeof Sku provides string keys ("ipd"|"mbp"|"atv"|"vga").
- Item (src/model/item.ts)
  - Fields: sku: Sku, price: number (constructor parameter but not actively used in calculations; price is taken from ItemPricingMap).

In-memory maps (act as tables)
- ItemInventory (src/itemInventory.ts)
  - Map<Sku, number> itemInventoryMap
  - Defaults: 1000 units for each SKU.
  - Methods:
    - checkIfProductAvailable(sku): boolean -> (stock > 0)
    - reduceProductCount(input: {sku, count}[]): batch reduce with validation
    - reduceItemCount(sku, count): internal helper with insufficient stock guard
- ItemPricingMap (src/itemPricingMap.ts)
  - Map<Sku, number> map
  - Prices:
    - ipd: 549.99
    - mbp: 1399.99
    - atv: 109.50
    - vga: 30.00
  - Methods: getPriceOfItem(sku)

Suggested database schema (if persisted)
- products
  - sku (PK, text)
  - name (text)
  - price (numeric(10,2))
- inventory
  - sku (PK/FK -> products.sku)
  - on_hand (integer)
- pricing_rules
  - id (PK)
  - type (text)  -- e.g., "BUY_X_GET_Y", "BULK_PRICE"
  - params (jsonb)
  - active (boolean)
- carts
  - id (PK)
  - created_at, status
- cart_items
  - cart_id (FK -> carts.id)
  - sku (FK -> products.sku)
  - quantity (integer)
  - PRIMARY KEY (cart_id, sku)

PlantUML ER diagram
@startuml
entity products {
  * sku : text <<PK>>
  --
  name : text
  price : numeric(10,2)
}
entity inventory {
  * sku : text <<PK>> <<FK>>
  on_hand : integer
}
entity pricing_rules {
  * id : uuid <<PK>>
  type : text
  params : jsonb
  active : boolean
}
entity carts {
  * id : uuid <<PK>>
  created_at : timestamptz
  status : text
}
entity cart_items {
  * cart_id : uuid <<PK>> <<FK>>
  * sku : text <<PK>> <<FK>>
  quantity : integer
}
products ||--o{ inventory : has
products ||--o{ cart_items : in
carts ||--o{ cart_items : contains
@enduml

Query patterns (hypothetical if persisted)
- Check availability for a SKU
  SELECT on_hand FROM inventory WHERE sku = $1 FOR UPDATE;
- Reserve/fulfill items (deduct)
  UPDATE inventory SET on_hand = on_hand - $2 WHERE sku = $1 AND on_hand >= $2;
- Compute cart price
  SELECT ci.sku, ci.quantity, p.price FROM cart_items ci JOIN products p USING (sku) WHERE ci.cart_id = $1;
- Pricing rules lookup
  SELECT * FROM pricing_rules WHERE active = true;
