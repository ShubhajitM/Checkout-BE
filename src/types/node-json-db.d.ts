declare module 'node-json-db' {
  export class Config {
    constructor(
      filename: string,
      saveOnPush?: boolean,
      humanReadable?: boolean,
      separator?: string
    );
  }

  export class JsonDB {
    constructor(config: Config);
    push(path: string, data: any, override?: boolean): void;
    getData<T = any>(path: string): T;
  }
}
