import * as fs from 'fs';
import * as path from 'path';

export class JsonDb<T> {
  private readonly filePath: string;

  constructor(relativePath: string) {
    const root = process.cwd();
    this.filePath = path.resolve(root, relativePath);
    this.ensureDirExists();
    this.ensureFileExists();
  }

  read(): T {
    const content = fs.readFileSync(this.filePath, { encoding: 'utf8' });
    if (!content || content.trim().length === 0) {
      return JSON.parse('{}') as T;
    }
    return JSON.parse(content) as T;
  }

  write(data: T): void {
    const json = JSON.stringify(data, null, 2);
    fs.writeFileSync(this.filePath, json, { encoding: 'utf8' });
  }

  private ensureDirExists(): void {
    const dir = path.dirname(this.filePath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  }

  private ensureFileExists(): void {
    if (!fs.existsSync(this.filePath)) {
      fs.writeFileSync(this.filePath, '', { encoding: 'utf8' });
    }
  }
}
