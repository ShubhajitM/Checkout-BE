import { Sku } from './model/sku';
import { CatalogService } from './catalog/catalogService';

class ItemInventory {

  public static checkIfProductAvailable(sku: Sku): boolean {
    return CatalogService.getQuantity(sku) > 0;
  }

  public static reduceProductCount(input: {sku: Sku, count: number}[]): void {
    input.forEach(record => {
      const { sku, count } = record;
      this.reduceItemCount(sku, count);
    });
  }

  static reduceItemCount(sku: Sku, count: number): void {
    CatalogService.reduceQuantity(sku, count);
  }

}

export { ItemInventory };
