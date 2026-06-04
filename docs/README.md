Checkout-BE Technical Wiki

Summary
- Purpose: Simple checkout/pricing engine with pluggable pricing rules and in-memory inventory/pricing maps.
- Scope: Library-style code without an HTTP server or database. Example usage is in src/app.ts.
- Key concepts: CheckOut implementation, ShoppingCart, PricingRule interface with concrete rules, ItemPricingMap (price list), ItemInventory (stock), Item/Sku models.

Quick links
- Architecture: ./architecture.md
- Data model and schema: ./data-model.md
- Flows and sequence diagrams: ./flows.md
- Pricing rules: ./pricing-rules.md
- Usage and examples: ./usage.md
- Postman/API notes: ./postman.md

Environment
- Node.js with Yarn.
- TypeScript runtime via ts-node.
- No external services or databases.

Repository map (high-level)
- src/app.ts: Example bootstrap showing rule loading and scanning flow.
- src/checkout: Interfaces and concrete checkout implementation.
- src/pricing_rules: PricingRule interface and rule implementations.
- src/model: Core domain types (Item, Sku).
- src: ItemInventory and ItemPricingMap static singletons; ShoppingCart.
