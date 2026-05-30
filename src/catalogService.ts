import fs from 'fs';
import path from 'path';
import { Sku } from './model/sku';
import { ItemPricingMap } from './itemPricingMap';
import { ItemInventory } from './itemInventory';

interface RawCatalogItem {
  sku: string;
  price: number;
  inventory: number;
}

export class CatalogService {
  static initialize(catalogFilePath?: string): void {
    const filePath = catalogFilePath
      ? path.resolve(catalogFilePath)
      : path.resolve(__dirname, 'catalog', 'catalog.json');

    let data: unknown;
    try {
      const fileContent = fs.readFileSync(filePath, { encoding: 'utf-8' });
      data = JSON.parse(fileContent);
    } catch (err) {
      throw new Error(`Failed to load catalog from ${filePath}: ${(err as Error).message}`);
    }

    if (!Array.isArray(data)) {
      throw new Error('Catalog JSON must be an array of items');
    }

    const prices: { sku: Sku; price: number }[] = [];
    const inventory: { sku: Sku; count: number }[] = [];

    data.forEach((raw, index) => {
      const item = raw as Partial<RawCatalogItem>;
      if (!item || typeof item.sku !== 'string') {
        throw new Error(`Catalog item at index ${index} is missing a valid sku`);
      }
      if (typeof item.price !== 'number' || Number.isNaN(item.price) || item.price < 0) {
        throw new Error(`Catalog item ${item.sku} has invalid price (must be a non-negative number)`);
      }
      if (typeof item.inventory !== 'number' || !Number.isInteger(item.inventory) || item.inventory < 0) {
        throw new Error(`Catalog item ${item.sku} has invalid inventory`);
      }

      const skuValue = item.sku as Sku;
      if (!Object.values(Sku).includes(skuValue)) {
        throw new Error(`Unknown SKU in catalog: ${item.sku}`);
      }

      prices.push({ sku: skuValue, price: item.price });
      inventory.push({ sku: skuValue, count: item.inventory });
    });

    ItemPricingMap.setPrices(prices);
    ItemInventory.initializeInventory(inventory);
  }
}
