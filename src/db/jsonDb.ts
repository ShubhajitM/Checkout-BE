import { Sku } from "../model/sku";
import * as fs from 'fs';
import * as path from 'path';

type InventoryStore = Record<string, number>;

export class JSONDb {
  private filePath: string;

  constructor(filePath: string) {
    this.filePath = filePath;
    this.ensureInit();
  }

  getCount(sku: Sku): number {
    const data = this.read();
    return data[sku] ?? 0;
  }

  setCount(sku: Sku, count: number): void {
    const data = this.read();
    data[sku] = count;
    this.write(data);
  }

  reduceCount(sku: Sku, count: number): void {
    const current = this.getCount(sku);
    if (current < count) {
      throw new Error(`Insufficient stock for SKU: ${sku}`);
    }
    this.setCount(sku, current - count);
  }

  isAvailable(sku: Sku): boolean {
    return this.getCount(sku) > 0;
  }

  private ensureInit(): void {
    const dir = path.dirname(this.filePath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    if (!fs.existsSync(this.filePath)) {
      this.write({});
    }
  }

  private read(): InventoryStore {
    const raw = fs.readFileSync(this.filePath, { encoding: 'utf-8' });
    try {
      const parsed = JSON.parse(raw);
      return (parsed && typeof parsed === 'object') ? parsed : {};
    } catch (_) {
      return {};
    }
  }

  private write(data: InventoryStore): void {
    fs.writeFileSync(this.filePath, JSON.stringify(data, null, 2), { encoding: 'utf-8' });
  }
}
