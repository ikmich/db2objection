import { Knex } from 'knex';
import { ModelDescriptor } from '../index';

export interface DbParser {
  getTableNames: () => Promise<string[]>;
  buildModelDescriptors: () => Promise<ModelDescriptor[]>;
}

export abstract class BaseDbParser implements DbParser {
  constructor(protected knex: Knex) {}

  abstract getTableNames(): Promise<string[]>;

  abstract buildModelDescriptors(): Promise<ModelDescriptor[]>;
}
