import { Sku } from "./sku";

export interface CatalogItem {
  sku: Sku;
  name: string;
  price: number;
  quantity: number;
}
