import { BaseDbParser } from './db-parser';

// Todo - Implement PostgresParser
export class PostgresParser extends BaseDbParser {
  async getTableNames(): Promise<string[]> {
    return [];
  }

  buildModelDescriptors(): Promise<any> {
    console.log('not implemented (postgres)');
    return Promise.resolve(undefined);
  }
}
