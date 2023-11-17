import { BaseDbParser } from './DbParser.js';
import { configUtil } from '../util/config.util.js';
import { filer } from '../libs/filer.js';
import { _debug, getDebugFilePath } from '../util/index.js';
import { IModel, IProperty, PostgresColumnInfo, PostgresTableInfo } from '../index.js';
import * as ChangeCase from 'change-case';
import appData from '../util/app-data.js';
import pkg from 'pluralize';

const { singular } = pkg;

export class PostgresParser extends BaseDbParser {
  async getTableNames(): Promise<string[]> {
    const targetDatabase = appData.getDatabase();
    if (!targetDatabase) {
      throw new Error('database connection parameter not found');
    }

    const tablesQueryResult = await this.knex.raw(`
SELECT 
       t.table_schema,
       t.table_name
FROM ${targetDatabase}.information_schema.tables t
WHERE t.table_schema NOT IN ('pg_catalog', 'information_schema')`);

    const IGNORE_LIST = configUtil.getPropIgnoreTables() || [];

    const tableInfoList: PostgresTableInfo[] = (Array.from(tablesQueryResult.rows || []) as PostgresTableInfo[]).filter(
      (record) => {
        return !IGNORE_LIST.includes(record.table_name);
      }
    );

    _debug(() => {
      filer.write({
        data: tableInfoList,
        file: getDebugFilePath('tableInfoList.txt')
      });
    });

    const tables = tableInfoList.map((item) => `${item.table_schema}.${item.table_name}`);

    _debug(() => {
      filer.write({
        data: tables,
        file: getDebugFilePath('tables.txt')
      });
    });

    return tables;
  }

  async buildModelDescriptors(selectTables?: string[]): Promise<IModel[]> {
    let tablePaths = await this.getTableNames();

    if (Array.isArray(selectTables)) {
      const _selectTables = selectTables.map((entry) => {
        const parts = entry.split('.');
        if (parts.length === 1) {
          // not schema qualified. use public schema
          return 'public.' + entry;
        }
        return entry;
      });
      tablePaths = tablePaths.filter((tablePath) => _selectTables.includes(tablePath));
    }

    const models: IModel[] = [];

    for (let tablePath of tablePaths) {
      const tableName = tablePath.split('.')[1];
      let idColumn = '';

      const properties: IProperty[] = [];

      // Get column info
      const columnsQueryResult = await this.knex.raw(`
SELECT col.column_name,
       col.ordinal_position,
       col.column_default,
       col.is_nullable,
       col.data_type
FROM pg_project.information_schema.columns col
WHERE col.table_schema NOT IN ('pg_catalog', 'information_schema')
  AND col.table_name = '${tableName}';`);

      const columnInfos: PostgresColumnInfo[] = columnsQueryResult.rows;

      _debug(() => {
        filer.write({
          data: columnInfos,
          file: getDebugFilePath(`table-columns-${tablePath}.txt`)
        });
      });

      for (let columnInfo of columnInfos) {
        const _type = PostgresParser.getPropertyType(columnInfo.data_type);
        const property: Partial<IProperty> = {
          name: columnInfo.column_name,
          type: _type,
          defaultVal: PostgresParser.getDefaultRenderedValueForType(_type),
          isNullable: columnInfo.is_nullable && columnInfo.is_nullable.toLowerCase() === 'yes'
        };

        await this.obtainColumnConstraints(columnInfo, tableName);

        property.isPrimaryKey = (() => {
          for (let constraint of columnInfo.constraints) {
            if (constraint.endsWith('_pkey')) {
              idColumn = columnInfo.column_name;
              return true;
            }
          }
          return false;
        })();

        properties.push(property as IProperty);
      }

      const modelTableName = (() => {
        /* The public schema is the default schema, and is not needed to qualify the table. */
        if (tablePath.startsWith('public.')) {
          return tablePath.split('.')[1];
        }
        return tablePath;
      })();

      const model: Partial<IModel> = {
        modelName: ChangeCase.pascalCase(singular(tableName)),
        tableName: modelTableName,
        modelProperties: properties,
        idColumn
      };

      models.push(model as IModel);
    }

    _debug(() => {
      filer.write({
        data: models,
        file: getDebugFilePath(`models.txt`)
      });
    });

    return models;
  }

  private async obtainColumnConstraints(columnInfo: PostgresColumnInfo, tableName: string) {
    const constraintQueryResult = await this.knex.raw(`
SELECT
       kcu.constraint_name AS constraint_name
FROM pg_project.information_schema.key_column_usage kcu
WHERE kcu.table_schema NOT IN ('pg_catalog', 'information_schema')
  AND kcu.table_name = '${tableName}'
  AND kcu.column_name = '${columnInfo.column_name}';`);

    const constraintInfos: { constraint_name: string }[] = constraintQueryResult.rows;

    _debug(() => {
      filer.write({
        data: constraintInfos,
        file: getDebugFilePath(`constraint-info-${tableName}.${columnInfo.column_name}.txt`)
      });
    });

    columnInfo.constraints = constraintInfos.map((ob) => ob.constraint_name);
  }
}
