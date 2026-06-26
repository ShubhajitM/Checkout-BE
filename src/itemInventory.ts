import { Sku } from './model/sku';
import { InventoryDb } from './db/inventoryDb';

class ItemInventory {
  private static readonly db = new InventoryDb();

  public static checkIfProductAvailable(sku: Sku): boolean {
    return this.db.isAvailable(sku);
  }

  public static reduceProductCount(input: { sku: Sku; count: number }[]): void {
    this.db.reduceCounts(input);
  }

  static reduceItemCount(sku: Sku, count: number): void {
    this.db.reduceCount(sku, count);
  }
}

export { ItemInventory };
