import { JsonDB, Config } from 'node-json-db';
import { Sku } from '../model/sku';

type StoredItem = {
  sku: Sku;
  timestamp: string;
};

class ItemJsonDb {
  private static instance: ItemJsonDb;
  private db: JsonDB;

  private constructor() {
    this.db = new JsonDB(new Config('itemsDb', true, true, '/'));
  }

  static getInstance(): ItemJsonDb {
    if (!ItemJsonDb.instance) {
      ItemJsonDb.instance = new ItemJsonDb();
    }
    return ItemJsonDb.instance;
  }

  addItem(sku: Sku): void {
    const record: StoredItem = { sku, timestamp: new Date().toISOString() };
    this.db.push('/items[]', record, true);
  }

  getItems(): StoredItem[] {
    try {
      return this.db.getData('/items');
    } catch {
      return [];
    }
  }

  clear(): void {
    this.db.push('/items', [], true);
  }
}

export { ItemJsonDb };
