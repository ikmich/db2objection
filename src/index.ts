import { Knex } from 'knex';

export const CONFIG_FILENAME = 'db2objection.config.js';
export const DEFAULT_MODELS_DIRNAME = 'db2objection-models';
export const DEBUG_DIRNAME = 'db2obj-debug';

export interface IConfig {
  // When this contract is updated, ensure to update the logic in InitCommand for generating the file in the host.
  knex: {
    client: string;
    connection: Knex.StaticConnectionConfig;
  };
  modelsOutputDir: string;
  ignoreTables?: string[];
}

export interface PropertyMeta {
  name: string;
  type: string;
  isNullable?: boolean;
  isPrimaryKey?: boolean;
  defaultVal?: any;
}

export interface ModelDescriptor {
  tableName: string;
  idColumn?: string;
  modelName: string;
  modelProperties: PropertyMeta[];
}

export interface MysqlTableInfo {
  Field: string;
  Type: string;
  Null: string;
  Key: string;
  Default: string;
  Extra: string;
}

export interface PostgresTableInfo {}

export interface SqliteTableInfo {}
