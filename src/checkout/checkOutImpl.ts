import { PricingRule } from '../pricing_rules/pricingRule';
import { ItemInventory } from '../itemInventory';
import { Item } from '../model/item';
import { ShoppingCart } from '../shoppingCart';
import { CheckOut } from './checkOut';
import { Sku, SkuKeyType } from '../model/sku';

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

  public scanSku (sku: SkuKeyType): void {
    // check if product available
    const itemSku = Sku[sku];
    if (ItemInventory.checkIfProductAvailable(itemSku)) {
      const item = new Item(itemSku);
      this.shoppingCart.addItemInCart(item);
    } else {
      throw new Error(`Order can't be fulfilled for this item: ${itemSku}`);
    }
  }

  public total(): number {
    const scClone = this.shoppingCart.clone();
    for (const rule of this.pricingRuleList) {
      this.shoppingCart.addDiscount(rule.apply(scClone));
    }

    const netTotal = this.shoppingCart.getTotalPrice() - this.shoppingCart.getTotalDiscount();

    this.fullFillmentAction();

    return netTotal;
  }

  private fullFillmentAction(): void {
    this.shoppingCart.reduceProductCount();
    this.shoppingCart = new ShoppingCart();
  }
}
