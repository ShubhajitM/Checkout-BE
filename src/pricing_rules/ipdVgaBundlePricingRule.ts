import { PricingRule } from "./pricingRule";
import { ShoppingCart } from "../shoppingCart";
import { Sku } from "../model/sku";
import { ItemPricingMap } from "../itemPricingMap";
import { PricingRuleRegistry } from "./pricingRuleRegistry";

export class IpdVgaBundlePricingRule implements PricingRule {
  apply(shoppingCart: ShoppingCart): number {
    const ipdCount = shoppingCart.getItemCountInCart(Sku.ipd);
    const eligibleFreeVga = Math.floor(ipdCount / 2);
    if (eligibleFreeVga <= 0) return 0.0;
    return ItemPricingMap.getPriceOfItem(Sku.vga) * eligibleFreeVga;
  }
}

PricingRuleRegistry.register(new IpdVgaBundlePricingRule());
