import { PricingRule } from '../pricing_rules/pricingRule';
import { ItemInventory } from '../itemInventory';
import { Item } from '../model/item';
import { ShoppingCart } from '../shoppingCart';
import { CheckOut } from './checkOut';

export class CheckOutImpl implements CheckOut {
  private pricingRuleList: PricingRule[];

  private shoppingCart: ShoppingCart;

  constructor(pricingRuleList: PricingRule[]) {
    this.pricingRuleList = pricingRuleList;
    this.shoppingCart = new ShoppingCart();
  }

  public scan(item: Item): void {
    // check if product available
    if (ItemInventory.checkIfProductAvailable(item.getSku())) {
      this.shoppingCart.addItemInCart(item);
    } else {
      throw new Error(`Order can't be fulfilled for this item: ${item.getSku()}`);
    }
  }

  public total(): number {
    for (const rule of this.pricingRuleList) {
      this.shoppingCart.addDiscount(rule.apply(this.shoppingCart));
    }

    const netTotal = this.shoppingCart.getTotalPrice() - this.shoppingCart.getTotalDiscount();

    this.fullFillmentAction();

    return netTotal;
  }

  private fullFillmentAction(): void {
    // TODO - remove from ItemInventory
    this.shoppingCart = new ShoppingCart();
  }
}
