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
}

export { ItemInventory };
