import { PricingRule } from "./pricingRule";
import { ShoppingCart } from "../shoppingCart";
import { Sku } from "../model/sku";
import { ItemPricingMap } from "../itemPricingMap";

export class MacBookProPricingRule implements PricingRule {
  apply(shoppingCart: ShoppingCart): number {
    const mbpCount = shoppingCart.getItemCountInCart(Sku.mbp);
    const vgaCount = shoppingCart.getItemCountInCart(Sku.vga);

    if (mbpCount <= 0 || vgaCount <= 0) return 0.0;

    const eligibleFree = Math.min(mbpCount, vgaCount);
    return eligibleFree * ItemPricingMap.getPriceOfItem(Sku.vga);
  }
}
