import { Sku } from './model/sku';
import * as fs from 'fs';
import * as path from 'path';

class ItemInventory {
  private static itemInventoryMap: Map<Sku, number> = new Map();
  private static initialized = false;
  private static readonly inventoryFilePath = path.resolve(__dirname, 'db', 'inventory.json');

  private static ensureInitialized(): void {
    if (this.initialized) return;
    try {
      if (!fs.existsSync(this.inventoryFilePath)) {
        const defaultData: Record<string, number> = {
          [Sku.ipd]: 1000,
          [Sku.mbp]: 1000,
          [Sku.atv]: 1000,
          [Sku.vga]: 1000,
        };
        fs.mkdirSync(path.dirname(this.inventoryFilePath), { recursive: true });
        fs.writeFileSync(this.inventoryFilePath, JSON.stringify(defaultData, null, 2), 'utf-8');
      }
      const raw = fs.readFileSync(this.inventoryFilePath, 'utf-8');
      const data = JSON.parse(raw) as Record<string, number>;
      this.itemInventoryMap = new Map<Sku, number>(
        Object.entries(data).map(([k, v]) => [k as Sku, Number(v)])
      );
      this.initialized = true;
    } catch (e) {
      this.itemInventoryMap = new Map<Sku, number>([
        [Sku.ipd, 1000],
        [Sku.mbp, 1000],
        [Sku.atv, 1000],
        [Sku.vga, 1000],
      ]);
      this.initialized = true;
    }
  }

  private static persist(): void {
    try {
      const obj: Record<string, number> = {};
      this.itemInventoryMap.forEach((value, key) => {
        obj[key] = value;
      });
      fs.writeFileSync(this.inventoryFilePath, JSON.stringify(obj, null, 2), 'utf-8');
    } catch (_) {
      // Best-effort persistence; ignore write errors here
    }
  }

  public static checkIfProductAvailable(sku: Sku): boolean {
    this.ensureInitialized();
    return (this.itemInventoryMap.get(sku) ?? 0) > 0;
  }

  public static reduceProductCount(input: { sku: Sku; count: number }[]): void {
    this.ensureInitialized();
    input.forEach((record) => {
      const { sku, count } = record;
      this.reduceItemCount(sku, count);
    });
    this.persist();
  }

  static reduceItemCount(sku: Sku, count: number): void {
    this.ensureInitialized();
    const currentCount = this.itemInventoryMap.get(sku) ?? 0;
    if (currentCount >= count) {
      this.itemInventoryMap.set(sku, currentCount - count);
    } else {
      throw new Error(`Insufficient stock for SKU: ${sku}`);
    }
  }
}

export { ItemInventory };
