import { JsonDb } from './jsonDb';

export interface AccountRecord {
  id: string;
  name: string;
  discountRate?: number;
}

export type AccountsData = Record<string, AccountRecord>;

export class AccountsDb {
  private readonly db: JsonDb<AccountsData>;

  constructor(filePath = 'data/accounts.json') {
    this.db = new JsonDb<AccountsData>(filePath);
    this.ensureDefaults();
  }

  getAccount(id: string): AccountRecord | undefined {
    const data = this.db.read();
    return data[id];
  }

  upsertAccount(account: AccountRecord): void {
    const data = this.db.read();
    data[account.id] = account;
    this.db.write(data);
  }

  listAccounts(): AccountRecord[] {
    const data = this.db.read();
    return Object.values(data);
  }

  deleteAccount(id: string): void {
    const data = this.db.read();
    delete data[id];
    this.db.write(data);
  }

  private ensureDefaults(): void {
    const data = this.db.read();
    if (Object.keys(data).length === 0) {
      this.db.write({
        DEFAULT: { id: 'DEFAULT', name: 'Default', discountRate: 0 },
      });
    }
  }
}
