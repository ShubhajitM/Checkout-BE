import { JsonDb } from './jsonDb';
import { Sku } from '../model/sku';

export type PricingData = Record<string, number>;

export class PricingDb {
  private readonly db: JsonDb<PricingData>;

  constructor(filePath = 'data/pricing.json') {
    this.db = new JsonDb<PricingData>(filePath);
    this.ensureDefaults();
  }

  getPrice(sku: Sku): number {
    const data = this.db.read();
    return data[sku] ?? 0;
  }

  setPrice(sku: Sku, price: number): void {
    const data = this.db.read();
    data[sku] = price;
    this.db.write(data);
  }

  private ensureDefaults(): void {
    const data = this.db.read();
    const ensured: PricingData = { ...data };

    if (ensured[Sku.ipd] === undefined) ensured[Sku.ipd] = 549.99;
    if (ensured[Sku.mbp] === undefined) ensured[Sku.mbp] = 1399.99;
    if (ensured[Sku.atv] === undefined) ensured[Sku.atv] = 109.5;
    if (ensured[Sku.vga] === undefined) ensured[Sku.vga] = 30.0;

    this.db.write(ensured);
  }
}
