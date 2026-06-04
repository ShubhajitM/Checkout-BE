Pricing rules

Contract
- Interface: PricingRule { apply(shoppingCart: ShoppingCart): number }
- The apply method:
  - Receives a read-only snapshot (clone) of the current cart to avoid mutation side effects.
  - Must return a non-negative numeric discount to be subtracted from the gross total.
  - Should not depend on rule execution order if rules are intended to be independent.

Included rules
- AppleTvPricingRule (src/pricing_rules/appleTvPricingRule.ts)
  - Deal: For Apple TV (Sku.atv), buy 3 pay for 2.
  - Implementation: discount = floor(count/3) * price(atv).
  - Edge cases: If count < 3, discount is 0. Ignores additional promotions.

- SuperIpadPricingRule (src/pricing_rules/superIpadPricingRule.ts)
  - Deal: Bulk discount for Super iPad (Sku.ipd) when quantity > 4: unit price reduced to 499.99.
  - Implementation: discount = (listPrice(ipd) - 499.99) * count if count > 4, else 0.
  - Edge cases: Exactly 5 or more applies bulk price to all ipd units in the cart.

Extending with new rules
- Create a new class implementing PricingRule in src/pricing_rules/.
- Inspect the ShoppingCart snapshot to determine applicable discounts.
- Return the discount amount; ensure it is additive with other rules or document exclusivity.
- Register the rule in the bootstrap (e.g., src/app.ts).
