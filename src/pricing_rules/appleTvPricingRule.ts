import { PricingRule } from "./pricingRule";
import { ShoppingCart } from "../shoppingCart";
import { Sku } from "../model/sku";
import { ItemPricingMap } from "../itemPricingMap";

export class AppleTvPricingRule implements PricingRule {
  apply(shoppingCart: ShoppingCart): number {
    const count = shoppingCart.getItemCountInCart(Sku.atv);
    const freeItems = Math.floor(count / 3);
    return ItemPricingMap.getPriceOfItem(Sku.atv) * freeItems;
  }
}