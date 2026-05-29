import { Item } from "../model/item";
import { SkuKeyType } from "../model/sku";

export interface CheckOut {
    scan(item: Item): void;
    scanSku(sku: SkuKeyType): void;
    total(): number;
  }