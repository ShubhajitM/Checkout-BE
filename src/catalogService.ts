import fs from 'fs';
import path from 'path';
import { CatalogItem } from './model/catalogItem';
import { Sku } from './model/sku';
import { ItemInventory } from './itemInventory';
import { ItemPricingMap } from './itemPricingMap';

export class CatalogService {
  private static initialized = false;

  static initialize(): void {
    if (this.initialized) return;

    const filePath = path.resolve(__dirname, 'data', 'catalog.json');
    const raw = fs.readFileSync(filePath, 'utf-8');
    const parsed: Array<{ sku: string; name: string; price: number; quantity: number }> = JSON.parse(raw);

    const priceMap = new Map<Sku, number>();
    const inventoryMap = new Map<Sku, number>();

    for (const item of parsed) {
      const sku = item.sku as Sku;
      if (!Object.values(Sku).includes(sku)) {
        throw new Error(`Unknown SKU in catalog: ${item.sku}`);
      }
      priceMap.set(sku, item.price);
      inventoryMap.set(sku, item.quantity);
    }

    ItemPricingMap.setPrices(priceMap);
    ItemInventory.setInventory(inventoryMap);

    this.initialized = true;
  }
}
