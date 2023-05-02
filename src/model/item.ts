import { Sku } from "./sku";

export class Item {
    private price: number;
    private sku: Sku;
  
    constructor(sku: Sku, price = 0) {
      this.sku = sku;
      this.price = price;
    }
  
    public getPrice(): number {
      return this.price;
    }
  
    public getSku(): Sku {
      return this.sku;
    }
  }