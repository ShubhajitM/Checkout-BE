import { Sku } from './model/sku';
import { CatalogService } from './catalog/catalogService';

class ItemInventory {
  public static checkIfProductAvailable(sku: Sku): boolean {
    return CatalogService.isAvailable(sku);
  }

  public static reduceProductCount(input: {sku: Sku, count: number}[]): void {
    CatalogService.reduceCounts(input);
  }

  static reduceItemCount(sku: Sku, count: number): void {
    CatalogService.reduceItemCount(sku, count);
  }
}

export { ItemInventory };