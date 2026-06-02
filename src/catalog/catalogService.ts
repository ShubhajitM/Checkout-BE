import catalogItems from './catalogItems.json';
import { Sku } from '../model/sku';

type CatalogItem = {
  sku: keyof typeof Sku | string;
  price: number;
  quantity: number;
};

class CatalogService {
  private static pricingMap: Map<Sku, number> = new Map<Sku, number>();
  private static inventoryMap: Map<Sku, number> = new Map<Sku, number>();
  private static initialized = false;

  public static init(): void {
    this.ensureInitialized();
  }

  private static ensureInitialized(): void {
    if (this.initialized) return;

    const items = catalogItems as CatalogItem[];

    items.forEach((item) => {
      const key = (Sku as any)[item.sku as string] as Sku | undefined;
      if (!key) return;
      this.pricingMap.set(key, item.price);
      this.inventoryMap.set(key, item.quantity);
    });

    this.initialized = true;
  }

  public static getPrice(sku: Sku): number {
    this.ensureInitialized();
    return this.pricingMap.get(sku) ?? 0.0;
  }

  public static isAvailable(sku: Sku): boolean {
    this.ensureInitialized();
    return (this.inventoryMap.get(sku) ?? 0) > 0;
  }

  public static reduceCounts(input: { sku: Sku; count: number }[]): void {
    this.ensureInitialized();
    input.forEach(({ sku, count }) => this.reduceItemCount(sku, count));
  }

  public static reduceItemCount(sku: Sku, count: number): void {
    this.ensureInitialized();
    const currentCount = this.inventoryMap.get(sku) ?? 0;
    if (currentCount >= count) {
      this.inventoryMap.set(sku, currentCount - count);
    } else {
      throw new Error(`Insufficient stock for SKU: ${sku}`);
    }
  }
}

export { CatalogService };
