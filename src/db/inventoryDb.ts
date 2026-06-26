import { JsonDb } from './jsonDb';
import { Sku } from '../model/sku';

export type InventoryData = Record<string, number>;

export class InventoryDb {
  private readonly db: JsonDb<InventoryData>;
  private readonly defaultStock: number;

  constructor(filePath = 'data/inventory.json', defaultStock = 1000) {
    this.db = new JsonDb<InventoryData>(filePath);
    this.defaultStock = defaultStock;
    this.ensureDefaults();
  }

  isAvailable(sku: Sku): boolean {
    const inv = this.read();
    return (inv[sku] ?? 0) > 0;
  }

  getCount(sku: Sku): number {
    const inv = this.read();
    return inv[sku] ?? 0;
  }

  reduceCounts(input: { sku: Sku; count: number }[]): void {
    const inv = this.read();

    for (const { sku, count } of input) {
      const current = inv[sku] ?? 0;
      if (current < count) {
        throw new Error(`Insufficient stock for SKU: ${sku}`);
      }
    }

    for (const { sku, count } of input) {
      inv[sku] = (inv[sku] ?? 0) - count;
    }

    this.db.write(inv);
  }

  reduceCount(sku: Sku, count: number): void {
    this.reduceCounts([{ sku, count }]);
  }

  private read(): InventoryData {
    return this.db.read();
  }

  private ensureDefaults(): void {
    const inv = this.db.read();
    const ensured: InventoryData = { ...inv };

    for (const key of Object.values(Sku)) {
      if (ensured[key] === undefined) {
        ensured[key] = this.defaultStock;
      }
    }

    this.db.write(ensured);
  }
}
