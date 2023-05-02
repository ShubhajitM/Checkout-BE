import { Item } from "../model/item";

export interface CheckOut {

    scan(item: Item): void;
    total(): number;
  }