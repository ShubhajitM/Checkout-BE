import path from 'path';
import { Sku } from './model/sku';
import { JSONDB } from './db/jsonDb';

type InventoryRecord = Record<Sku, number>;

class ItemInventory {
  private static readonly db = new JSONDB<InventoryRecord>(
    path.resolve(process.cwd(), 'data', 'inventory.json'),
    {
      [Sku.ipd]: 1000,
      [Sku.mbp]: 1000,
      [Sku.atv]: 1000,
      [Sku.vga]: 1000,
    }
  );

  public static checkIfProductAvailable(sku: Sku): boolean {
    const data = this.db.read();
    return (data[sku] ?? 0) > 0;
  }

  public static reduceProductCount(input: { sku: Sku; count: number }[]): void {
    this.db.update((data) => {
      for (const { sku, count } of input) {
        const current = data[sku] ?? 0;
        if (current < count) {
          throw new Error(`Insufficient stock for SKU: ${sku}`);
        }
      }
      for (const { sku, count } of input) {
        const current = data[sku] ?? 0;
        data[sku] = current - count;
      }
    });
  }

  static reduceItemCount(sku: Sku, count: number): void {
    this.reduceProductCount([{ sku, count }]);
  }
}

export { ItemInventory };
