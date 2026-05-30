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

    const configuredPath = process.env.CATALOG_PATH;
    const filePath = configuredPath && configuredPath.trim().length > 0
      ? configuredPath
      : path.resolve(process.cwd(), 'src', 'catalog', 'catalog.json');

    try {
      const raw = readFileSync(filePath, { encoding: 'utf-8' });
      const json: CatalogJson = JSON.parse(raw);

      json.items.forEach((item) => {
        const isValidSku = Object.values(Sku).includes(item.sku as Sku);
        if (!isValidSku) {
          return;
        }
        if (item.price < 0 || item.quantity < 0) {
          return;
        }
        this.catalogMap.set(item.sku as Sku, {
          name: item.name,
          price: item.price,
          quantity: item.quantity,
        });
      });

      this.initialized = true;
    } catch (err) {
      throw new Error(`Failed to load catalog from ${filePath}: ${(err as Error).message}`);
    }
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
    const aggregated = new Map<Sku, number>();
    for (const { sku, count } of input) {
      if (count <= 0) {
        throw new Error(`Invalid count for SKU: ${sku}. Count must be > 0`);
      }
      aggregated.set(sku, (aggregated.get(sku) ?? 0) + count);
    }

    for (const [sku, total] of aggregated.entries()) {
      const current = this.getAvailableCount(sku);
      if (current < total) {
        throw new Error(`Insufficient stock for SKU: ${sku}`);
      }
    }

    for (const [sku, total] of aggregated.entries()) {
      const record = this.catalogMap.get(sku);
      if (record) {
        record.quantity -= total;
        this.catalogMap.set(sku, record);
      }
    }
  }
}
