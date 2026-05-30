import { Sku } from './model/sku';

class ItemInventory {
  private static itemInventoryMap: Map<Sku, number> = new Map([
    [Sku.ipd, 1000],
    [Sku.mbp, 1000],
    [Sku.atv, 1000],
    [Sku.vga, 1000],
  ]);

  public static initializeInventory(input: { sku: Sku; count: number }[]): void {
    const newMap = new Map<Sku, number>();
    input.forEach(({ sku, count }) => {
      if (!Number.isInteger(count) || count < 0) {
        throw new Error(`Invalid inventory count for ${sku}: ${count}`);
      }
      newMap.set(sku, count);
    });
    this.itemInventoryMap = newMap;
  }

  public static checkIfProductAvailable(sku: Sku): boolean {
    return (this.itemInventoryMap.get(sku) ?? 0) > 0;
  }

  public static reduceProductCount(input: { sku: Sku; count: number }[]): void {
    input.forEach((record) => {
      const { sku, count } = record;
      this.reduceItemCount(sku, count);
    });
  }

  static reduceItemCount(sku: Sku, count: number): void {
    const currentCount = this.itemInventoryMap.get(sku) ?? 0;
    if (currentCount >= count) {
      this.itemInventoryMap.set(sku, currentCount - count);
    } else {
      throw new Error(`Insufficient stock for SKU: ${sku}`);
    }
  }
}

export { ItemInventory };
