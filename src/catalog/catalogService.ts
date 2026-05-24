import fs from 'fs';
import path from 'path';
import { Sku } from '../model/sku';

export type CatalogRecord = { price: number; quantity: number };

export class CatalogService {
  private static initialized = false;
  private static catalogMap: Map<Sku, CatalogRecord> = new Map();

  public static init(): void {
    if (this.initialized) return;
    const filePath = path.join(__dirname, 'catalogItems.json');
    try {
      const raw = fs.readFileSync(filePath, 'utf-8');
      const data = JSON.parse(raw) as Record<string, CatalogRecord>;
      const map = new Map<Sku, CatalogRecord>();
      Object.keys(data).forEach((key) => {
        const skuKey = key as keyof typeof Sku;
        const sku = Sku[skuKey];
        if (sku) {
          const rec = data[key];
          map.set(sku, { price: rec.price, quantity: rec.quantity });
        }
      });
      if (map.size === 0) {
        throw new Error('No valid catalog items found in catalogItems.json');
      }
      this.catalogMap = map;
      this.initialized = true;
    } catch (e) {
      throw new Error(`Failed to load catalog items: ${(e as Error).message}`);
    }
  }

  private static ensureInit(): void {
    if (!this.initialized) this.init();
  }

  public static getPrice(sku: Sku): number {
    this.ensureInit();
    return this.catalogMap.get(sku)?.price ?? 0.0;
    }

  public static getQuantity(sku: Sku): number {
    this.ensureInit();
    return this.catalogMap.get(sku)?.quantity ?? 0;
  }

  public static reduceQuantity(sku: Sku, count: number): void {
    this.ensureInit();
    const rec = this.catalogMap.get(sku);
    const current = rec?.quantity ?? 0;
    if (current >= count) {
      const price = rec?.price ?? 0;
      this.catalogMap.set(sku, { price, quantity: current - count });
    } else {
      throw new Error(`Insufficient stock for SKU: ${sku}`);
    }
  }

  public static getAll(): Map<Sku, CatalogRecord> {
    this.ensureInit();
    return new Map(this.catalogMap);
  }
}
