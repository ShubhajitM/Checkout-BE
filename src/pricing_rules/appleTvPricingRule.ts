import { PricingRule } from "./pricingRule";
import { ShoppingCart } from "../shoppingCart";
import { Sku } from "../model/sku";
import { ItemPricingMap } from "../itemPricingMap";
import { PricingRuleRegistry } from "./pricingRuleRegistry";

export class AppleTvPricingRule implements PricingRule {
  apply(shoppingCart: ShoppingCart): number {
    const count = shoppingCart.getItemCountInCart(Sku.atv);
    const freeItems = Math.floor(count / 3);
    return ItemPricingMap.getPriceOfItem(Sku.atv) * freeItems;
  }
}

PricingRuleRegistry.register(new AppleTvPricingRule());
