import express from 'express';
import { CheckOutImpl } from './checkout/checkOutImpl';
import { AppleTvPricingRule } from './pricing_rules/appleTvPricingRule';
import { SuperIpadPricingRule } from './pricing_rules/superIpadPricingRule';
import { PricingRule } from './pricing_rules/pricingRule';

const app = express();
app.use(express.json());

const pricingRuleList: PricingRule[] = [];
const loadPricingRules = () => {
  pricingRuleList.push(new AppleTvPricingRule());
  pricingRuleList.push(new SuperIpadPricingRule());
};
loadPricingRules();

const ck = new CheckOutImpl(pricingRuleList);

app.post('/cart/items', (req, res) => {
  const { sku } = req.body;
  if (!sku) {
    return res.status(400).json({ error: 'Missing sku in request body' });
  }
  try {
    ck.scanSku(sku);
    return res.status(201).json({ message: 'Item added to cart' });
  } catch (error) {
    return res.status(400).json({ error: (error as Error).message });
  }
});

app.get('/cart/total', (req, res) => {
  try {
    const total = ck.total();
    return res.json({ total });
  } catch (error) {
    return res.status(400).json({ error: (error as Error).message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
