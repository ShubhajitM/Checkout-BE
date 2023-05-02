import { ItemPricingMap } from "../itemPricingMap";
import { ShoppingCart } from "../shoppingCart";
import { Sku } from "../model/sku";
import { PricingRule } from "./pricingRule";

export class SuperIpadPricingRule implements PricingRule{
    apply(shoppingCart: ShoppingCart): number {
        const countInCart = shoppingCart.getItemCountInCart(Sku.ipd)
        if (countInCart > 4) {
            return (ItemPricingMap.getPriceOfItem(Sku.ipd) - 499.99)*countInCart;
        }
        return 0.00;
    }
}