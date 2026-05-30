import { PricingRule } from "./pricingRule";
import { ShoppingCart } from "../shoppingCart";
import { Sku } from "../model/sku";
import { ItemPricingMap } from "../itemPricingMap";

export class VgaWithIpadPricingRule implements PricingRule {
  apply(shoppingCart: ShoppingCart): number {
    const ipdCount = shoppingCart.getItemCountInCart(Sku.ipd);
    if (ipdCount < 2) {
      return 0.0;
    }
    const eligibleFreeVga = Math.floor(ipdCount / 2);
    const discountPerVga = ItemPricingMap.getPriceOfItem(Sku.vga);
    return eligibleFreeVga * discountPerVga;
  }
}
