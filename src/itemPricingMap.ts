import { Sku } from "./model/sku";
import { CatalogService } from "./catalog/catalogService";

export class ItemPricingMap {
  public static getPriceOfItem(sku: Sku): number {
    return CatalogService.getPrice(sku);
  }
}
