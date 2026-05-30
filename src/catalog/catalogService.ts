import { readFileSync } from 'fs';
import path from 'path';
import { Sku } from '../model/sku';

type CatalogJson = {
  items: Array<{ sku: string; name: string; price: number; quantity: number }>;
};

type CatalogRecord = {
  name: string;
  price: number;
  quantity: number;
};

export class CatalogService {
  private static catalogMap: Map<Sku, CatalogRecord> = new Map();
  private static initialized = false;

  public static loadCatalog(): void {
    if (this.initialized) return;
    const filePath = path.join(__dirname, 'catalog.json');
    const raw = readFileSync(filePath, { encoding: 'utf-8' });
    const json: CatalogJson = JSON.parse(raw);

    json.items.forEach((item) => {
      const key = item.sku as keyof typeof Sku;
      if (Sku[key]) {
        const sku = Sku[key];
        this.catalogMap.set(sku, {
          name: item.name,
          price: item.price,
          quantity: item.quantity,
        });
      }
    });

    this.initialized = true;
  }

  public static getPrice(sku: Sku): number {
    return this.catalogMap.get(sku)?.price ?? 0.0;
  }

  public static getAvailableCount(sku: Sku): number {
    return this.catalogMap.get(sku)?.quantity ?? 0;
  }

  public static isAvailable(sku: Sku): boolean {
    return this.getAvailableCount(sku) > 0;
  }

  public static reduceProductCount(input: { sku: Sku; count: number }[]): void {
    input.forEach(({ sku, count }) => {
      const current = this.getAvailableCount(sku);
      if (current < count) {
        throw new Error(`Insufficient stock for SKU: ${sku}`);
      }
    });

    input.forEach(({ sku, count }) => {
      const record = this.catalogMap.get(sku);
      if (record) {
        record.quantity = record.quantity - count;
        this.catalogMap.set(sku, record);
      }
    });
  }
}
