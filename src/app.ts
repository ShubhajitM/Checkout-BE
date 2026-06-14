import express, { Request, Response, NextFunction } from 'express';
import { PricingRule } from './pricing_rules/pricingRule';
import { CheckOutImpl } from './checkout/checkOutImpl';
import { AppleTvPricingRule } from './pricing_rules/appleTvPricingRule';
import { SuperIpadPricingRule } from './pricing_rules/superIpadPricingRule';
import { Sku, SkuKeyType } from './model/sku';
import { ItemInventory } from './itemInventory';

const app = express();
app.use(express.json());

const pricingRuleList: PricingRule[] = [];

const loadPricingRules = () => {
  pricingRuleList.push(new AppleTvPricingRule());
  pricingRuleList.push(new SuperIpadPricingRule());
};

loadPricingRules();

const ck = new CheckOutImpl(pricingRuleList);

const isSkuKey = (val: any): val is SkuKeyType => typeof val === 'string' && Object.prototype.hasOwnProperty.call(Sku, val);

app.get('/', (_req: Request, res: Response) => {
  res.json({ status: 'OK' });
});

app.post('/scanItems', (req: Request, res: Response, next: NextFunction) => {
  try {
    const { sku, skus } = req.body ?? {};

    if (!sku && !Array.isArray(skus)) {
      return res.status(400).json({ error: 'Provide either sku or skus in request body' });
    }

    const toScan: SkuKeyType[] = [];

    if (sku) {
      if (!isSkuKey(sku)) {
        return res.status(400).json({ error: `Invalid sku: ${sku}` });
      }
      toScan.push(sku);
    }

    if (Array.isArray(skus)) {
      for (const s of skus) {
        if (!isSkuKey(s)) {
          return res.status(400).json({ error: `Invalid sku in list: ${s}` });
        }
        toScan.push(s);
      }
    }

    for (const s of toScan) {
      ck.scanSku(s);
    }

    res.json({ message: 'Items scanned successfully', scanned: toScan });
  } catch (err) {
    next(err);
  }
});

app.post('/placeOrder', (req: Request, res: Response, next: NextFunction) => {
  try {
    const total = ck.total();
    res.json({ total });
  } catch (err) {
    next(err);
  }
});

app.patch('/inventory', (req: Request, res: Response, next: NextFunction) => {
  try {
    const { sku, count } = req.body ?? {};
    if (!sku || typeof count !== 'number' || count < 0) {
      return res.status(400).json({ error: 'Body must include valid sku and non-negative count' });
    }
    if (!isSkuKey(sku)) {
      return res.status(400).json({ error: `Invalid sku: ${sku}` });
    }

    ItemInventory.setProductCount(Sku[sku], count);

    res.json({ message: 'Inventory updated', sku, count });
  } catch (err) {
    next(err);
  }
});

// Error handler
app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
  const message = err instanceof Error ? err.message : 'Internal Server Error';
  res.status(400).json({ error: message });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`Server listening on port ${PORT}`);
});
