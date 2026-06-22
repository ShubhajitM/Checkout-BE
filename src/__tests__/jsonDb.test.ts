import * as fs from 'fs';
import * as path from 'path';
import { JSONDb } from '../db/jsonDb';
import { Sku } from '../model/sku';

const tempDir = path.join(__dirname, 'tmp');
const dbFile = path.join(tempDir, 'inventory.json');

describe('JSONDb', () => {
  beforeEach(() => {
    if (fs.existsSync(tempDir)) {
      fs.rmSync(tempDir, { recursive: true, force: true });
    }
  });

  test('initializes empty store and getCount returns 0 for unknown sku', () => {
    const db = new JSONDb(dbFile);
    expect(db.getCount(Sku.atv)).toBe(0);
  });

  test('setCount and getCount work as expected', () => {
    const db = new JSONDb(dbFile);
    db.setCount(Sku.ipd, 10);
    expect(db.getCount(Sku.ipd)).toBe(10);
  });

  test('isAvailable returns true when count > 0', () => {
    const db = new JSONDb(dbFile);
    db.setCount(Sku.mbp, 1);
    expect(db.isAvailable(Sku.mbp)).toBe(true);
  });

  test('reduceCount reduces and throws on insufficient stock', () => {
    const db = new JSONDb(dbFile);
    db.setCount(Sku.vga, 3);
    db.reduceCount(Sku.vga, 2);
    expect(db.getCount(Sku.vga)).toBe(1);
    expect(() => db.reduceCount(Sku.vga, 2)).toThrow('Insufficient stock for SKU: vga');
  });

  test('persists data to file between instances', () => {
    let db = new JSONDb(dbFile);
    db.setCount(Sku.atv, 5);

    db = new JSONDb(dbFile);
    expect(db.getCount(Sku.atv)).toBe(5);
  });
});
