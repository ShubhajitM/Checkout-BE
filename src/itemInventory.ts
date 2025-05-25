import { Sku } from './model/sku';

class ItemInventory {
  //default intialization
  private static itemInventoryMap: Map<Sku, number> = new Map([
    [Sku.ipd, 1000],
    [Sku.mbp, 1000],
    [Sku.atv, 1000],
    [Sku.vga, 1000],
  ]);

  public static checkIfProductAvailable(sku: Sku): boolean {
    return (this.itemInventoryMap.get(sku) ?? 0) > 0;
  }

  public static reduceProductCount(input: {sku: Sku, count: number}[]): void {
    input.forEach(record => {
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
