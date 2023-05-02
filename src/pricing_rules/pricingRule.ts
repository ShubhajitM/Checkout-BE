import { ShoppingCart } from "../shoppingCart";

export interface PricingRule{
    apply (shoppingCart : ShoppingCart): number;
}