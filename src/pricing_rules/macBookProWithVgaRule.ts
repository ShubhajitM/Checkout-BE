import { PricingRule } from "./pricingRule";
import { ShoppingCart } from "../shoppingCart";
import { Sku } from "../model/sku";
import { ItemPricingMap } from "../itemPricingMap";

export class MacBookProWithVgaPricingRule implements PricingRule {
  apply(shoppingCart: ShoppingCart): number {
    const mbpCount = shoppingCart.getItemCountInCart(Sku.mbp);
    const vgaCount = shoppingCart.getItemCountInCart(Sku.vga);
    const applicableFreeAdapters = Math.min(mbpCount, vgaCount);
    return applicableFreeAdapters * ItemPricingMap.getPriceOfItem(Sku.vga);
  }
}
