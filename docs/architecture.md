Architecture

Overview
- This project is a minimal checkout/pricing engine implemented in TypeScript. It exposes a CheckOut interface and a CheckOutImpl concrete class that maintains a ShoppingCart and applies a set of PricingRule implementations to compute discounts.
- There is no HTTP server or persistence layer. Example usage is executed directly through src/app.ts using ts-node.

Key components
- CheckOut (src/checkout/checkOut.ts): Interface with scan(item) and total(). The implementation also offers scanSku for convenience.
- CheckOutImpl (src/checkout/checkOutImpl.ts):
  - Holds a ShoppingCart and a list of PricingRule instances.
  - scan(item) and scanSku(sku): validate inventory availability via ItemInventory; if available, add to ShoppingCart; otherwise throw.
  - total():
    1) Clone the cart and pass the clone to each PricingRule to compute discount contributions.
    2) Sum rule discounts into the live cart's totalDiscount.
    3) Compute netTotal = getTotalPrice() - getTotalDiscount().
    4) Fulfillment: reduce inventory counts according to items in the cart, then reset the cart.
- ShoppingCart (src/shoppingCart.ts): Tracks quantities by Sku, calculates total price from ItemPricingMap, holds accumulated discount, supports cloning, and triggers inventory deduction.
- PricingRule (src/pricing_rules/pricingRule.ts): Strategy interface. Concrete rules examine the cart and return a discount amount.
  - AppleTvPricingRule: 3-for-2 deal for atv; discount = floor(count/3) * price(atv).
  - SuperIpadPricingRule: If ipd count > 4, apply per-item price reduction to 499.99; discount = (listPrice(ipd) - 499.99) * count.
- ItemInventory (src/itemInventory.ts): In-memory stock levels by SKU; validates availability; reduces counts during fulfillment.
- ItemPricingMap (src/itemPricingMap.ts): In-memory price list by SKU.
- Models: Item (sku, price?), Sku enum and SkuKeyType type.

Design notes
- Pricing rules are pure functions over a ShoppingCart snapshot (clone) and produce a numeric discount. This decouples rule logic from mutating the live cart while allowing aggregation of independent rule discounts.
- Fulfillment is part of total(). When total() is called, inventory is reduced and the cart is cleared by reinitializing ShoppingCart.
- Monetary values are represented as number and not rounded to currency minor units; callers should format as needed.
- The code assumes independent additive discounts; overlapping rules could produce compounded discounts if not carefully designed.

Assumptions and limitations
- No currency/locale handling.
- No persistence; data is volatile, and the inventory map is process-local.
- No concurrency control; simultaneous totals could race on inventory.
- No HTTP interface; this is a library or console app.

Extensibility
- Add new pricing rules by implementing PricingRule and pushing to the rule list.
- Replace ItemInventory/ItemPricingMap with adapters backed by a database or service if needed.
- Add a controller or server layer to expose HTTP APIs; see Postman notes for suggested endpoints.
