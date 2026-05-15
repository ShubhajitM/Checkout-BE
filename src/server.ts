import express from 'express';
import { CheckOutImpl } from './checkout/checkOutImpl';
import { PricingRule } from './pricing_rules/pricingRule';
import { AppleTvPricingRule } from './pricing_rules/appleTvPricingRule';
import { SuperIpadPricingRule } from './pricing_rules/superIpadPricingRule';
import { Sku } from './model/sku';

const app = express();
app.use(express.json());

const pricingRuleList: PricingRule[] = [];
const ck = new CheckOutImpl(pricingRuleList);

app.post('/discounts', (req, res) => {
  const { type } = req.body;
  let rule: PricingRule;
  if (type === 'appleTv') {
    rule = new AppleTvPricingRule();
  } else if (type === 'superIpad') {
    rule = new SuperIpadPricingRule();
  } else {
    return res.status(400).json({ error: 'Invalid rule type' });
  }
  pricingRuleList.push(rule);
  res.json({ message: 'Discount rule added' });
});

app.post('/cart/items', (req, res) => {
  const { sku } = req.body;
  if (typeof sku !== 'string' || !(sku in Sku)) {
    return res.status(400).json({ error: 'Invalid SKU' });
  }
  try {
    ck.scanSku(sku as keyof typeof Sku);
    res.json({ message: 'Item added to cart' });
  } catch (e: any) {
    res.status(400).json({ error: e.message });
  }
});

app.get('/cart/total', (req, res) => {
  try {
    const total = ck.total();
    res.json({ total });
  } catch (e: any) {
    res.status(400).json({ error: e.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
