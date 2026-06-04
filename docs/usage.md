Usage and examples

Prerequisites
- Node.js and Yarn installed.
- Install dependencies: yarn install

Run the example
- yarn start
- This compiles/transpiles on the fly via ts-node and executes src/app.ts.

Example code (src/app.ts)
- Loads pricing rules: AppleTvPricingRule, SuperIpadPricingRule.
- Scans a sequence of SKUs: atv, ipd, ipd, atv, ipd, ipd, ipd.
- Prints net total to console.

API surface (library usage)
- Construct checkout
  const rules: PricingRule[] = [new AppleTvPricingRule(), new SuperIpadPricingRule()];
  const ck = new CheckOutImpl(rules);

- Scan by SKU key
  ck.scanSku('atv');

- Scan by Item
  ck.scan(new Item(Sku.ipd));

- Get total
  const amount = ck.total();
  // Side-effect: reduces inventory for scanned items and resets cart

Notes
- total() empties the cart by replacing the ShoppingCart. After calling total(), subsequent scans start a new order.
- If an item is out of stock, scan/scanSku will throw.
- Prices and inventory are in-memory and process-local.
