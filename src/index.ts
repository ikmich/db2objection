// noinspection DuplicatedCode

import { Knex } from 'knex';
import Path from 'path';

export const CONFIG_FILENAME = 'db2objection.config.js';
export const DEFAULT_MODELS_DIRNAME = 'db2objection-models';
export const DEBUG_DIRNAME = 'db2objection-debug';
export const DEBUG_DIR_PATH = Path.join(process.cwd(), DEBUG_DIRNAME);

export interface IDb2ObjectionConfig {
  /**
   * Knex configuration.
   */
  knex: {
    client: string;
    connection: Knex.StaticConnectionConfig;
  };
  /**
   * Relative path where the objection models should be saved. Be careful, as the contents of this directory will be
   * overwritten when the `generate` command is run.
   */
  modelsOutputDir: string;

  /**
   * Tables for which models will not be generated.
   */
  ignoreTables?: string[];

  /**
   * Set to 'true' to use camelCase for the generated model properties
   */
  camelCase?: boolean;
}

export interface IProperty {
  name: string;
  type: string;
  isNullable?: boolean;
  isPrimaryKey?: boolean;
  defaultVal?: any;
}

export interface IModel {
  tableName: string;
  idColumn?: string;
  modelName: string;
  modelProperties: IProperty[];
}

export interface MysqlColumnInfo {
  Field: string;
  Type: string;
  Null: string;
  Key: string;
  Default: string;
  Extra: string;
}

export interface PostgresTableInfo {
  table_schema: string;
  table_name: string;
}

export interface PostgresColumnInfo {
  column_name: string;
  ordinal_position: number;
  column_default: string;
  is_nullable: 'yes' | 'no' | 'YES' | 'NO';
  data_type: string;
  constraints: string[];
}

export interface SqliteColumnInfo {
  cid: number;
  name: string;
  type: string;
  notnull: number;
  dflt_value: any;
  pk: number;
}
