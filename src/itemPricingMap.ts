import { Sku } from "./model/sku";
import { PricingDb } from "./db/pricingDb";

export class ItemPricingMap {
  private static readonly db = new PricingDb();

  public static getPriceOfItem(sku: Sku): number {
    return this.db.getPrice(sku);
  }
}
