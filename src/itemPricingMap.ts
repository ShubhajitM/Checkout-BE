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

  public static setPrices(prices: { sku: Sku; price: number }[]): void {
    const newMap = new Map<Sku, number>();
    prices.forEach(({ sku, price }) => {
      if (typeof price !== 'number' || Number.isNaN(price) || price < 0) {
        throw new Error(`Invalid price for ${String(sku)}: ${price}`);
      }
      newMap.set(sku, price);
    });
    this.map = newMap;
  }
}