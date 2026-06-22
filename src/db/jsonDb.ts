import fs from 'fs';
import path from 'path';

export class JSONDB<T extends object> {
  private readonly filePath: string;
  private readonly defaultData: T;

  constructor(filePath: string, defaultData: T) {
    this.filePath = filePath;
    this.defaultData = defaultData;
    this.ensureFile();
  }

  private ensureFile(): void {
    const dir = path.dirname(this.filePath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    if (!fs.existsSync(this.filePath)) {
      this.write(this.defaultData);
      return;
    }

    try {
      const raw = fs.readFileSync(this.filePath, 'utf-8');
      JSON.parse(raw);
    } catch {
      this.write(this.defaultData);
    }
  }

  read(): T {
    const raw = fs.readFileSync(this.filePath, 'utf-8');
    return JSON.parse(raw) as T;
  }

  write(data: T): void {
    fs.writeFileSync(this.filePath, JSON.stringify(data, null, 2), 'utf-8');
  }

  update(updater: (data: T) => T | void): T {
    const data = this.read();
    const updated = (updater(data) || data) as T;
    this.write(updated);
    return updated;
  }
}
