import { Sku } from "./model/sku";
import { ItemPricingMap } from "./itemPricingMap";
import { Item } from "./model/item";

export class ShoppingCart {
  private readonly checkOutList: Map<Sku, number>;
  private totalPrice: number;
  private totalDiscount: number;

  constructor() {
    this.checkOutList = new Map<Sku, number>();
    this.totalPrice = 0.00;
    this.totalDiscount = 0.00;
  }

  public getItemCountInCart(sku: Sku): number {
    return this.checkOutList.get(sku) || 0;
  }

  public addItemInCart(item: Item): void {
    const quantity = this.checkOutList.get(item.getSku()) || 0;
    this.checkOutList.set(item.getSku(), quantity + 1);
  }

  public getTotalPrice(): number {
    this.totalPrice = 0.00;
    for (const [sku, quantity] of this.checkOutList.entries()) {
      this.totalPrice = this.totalPrice +
        quantity * ItemPricingMap.getPriceOfItem(sku);
    }
    return this.totalPrice;
  }

  public getTotalDiscount(): number {
    return this.totalDiscount;
  }

  public addDiscount(discount: number): void {
    this.totalDiscount = this.totalDiscount + (discount);
  }
}
