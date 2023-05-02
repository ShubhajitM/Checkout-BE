import { Sku } from "./model/sku";

export class ItemPricingMap {
  private static map = new Map<Sku, number>([
    [Sku.ipd, 549.99],
    [Sku.mbp, 1399.99],
    [Sku.atv, 109.50],
    [Sku.vga, 30.00]
  ]);

  public static getPriceOfItem(sku: Sku): number {
    return this.map.get(sku) ?? 0.00;
  }
}