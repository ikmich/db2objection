import { BaseDbParser } from './db-parser';
import { ModelDescriptor } from '../index';

// Todo - Implement Sqlite parser
export class SqliteParser extends BaseDbParser {
  buildModelDescriptors(): Promise<ModelDescriptor[]> {
    return Promise.resolve([]);
  }

  getTableNames(): Promise<string[]> {
    return Promise.resolve([]);
  }
}
