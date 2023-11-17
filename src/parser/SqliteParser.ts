import { BaseDbParser } from './DbParser.js';
import { IModel, IProperty, SqliteColumnInfo } from '../types.js';
import { configUtil } from '../util/config.util.js';
import { filer } from '../libs/filer.js';
import { _debug, getDebugFilePath } from '../util/index.js';
import * as ChangeCase from 'change-case';
import pkg from 'pluralize';

const { singular } = pkg;

export class SqliteParser extends BaseDbParser {
  async buildModelDescriptors(selectTables?: string[]): Promise<IModel[]> {
    let tables = await this.getTableNames();

    if (Array.isArray(selectTables)) {
      tables = tables.filter((table) => selectTables.includes(table));
    }

    const modelDescriptors: IModel[] = [];

    for (let table of tables) {
      const tableInfos: SqliteColumnInfo[] = await this.knex.raw(`PRAGMA TABLE_INFO(${table})`);

      _debug(() => {
        filer.write({
          data: tableInfos,
          file: getDebugFilePath(`pragma-result-${table}.txt`)
        });
      });

      const properties: IProperty[] = [];
      let priColumn: string | undefined = undefined;

      for (let tableInfo of tableInfos) {
        const property: IProperty = SqliteParser.mapToProperty(tableInfo);
        if (property.isPrimaryKey) {
          priColumn = property.name;
        }
        properties.push(property);
      }

      const modelDescriptor: IModel = {
        modelName: ChangeCase.pascalCase(singular(table)),
        tableName: table,
        idColumn: priColumn,
        modelProperties: properties
      };

      modelDescriptors.push(modelDescriptor);
    }

    _debug(() => {
      filer.write({
        data: modelDescriptors,
        file: getDebugFilePath(`modelDescriptors.txt`)
      });
    });

    return modelDescriptors;
  }

  async getTableNames(): Promise<string[]> {
    let records: { name: string }[] = await this.knex.raw('select tbl_name as name from sqlite_master;');

    const ignoreList = configUtil.getIgnoreTablesProperty() || [];

    records = records.filter((record) => {
      return !ignoreList.includes(record.name);
    });

    return records.map((record) => {
      return record.name;
    });
  }

  private static mapToProperty(columnInfo: SqliteColumnInfo): IProperty {
    const type = this.getPropertyType(columnInfo.type);

    const isNullable = columnInfo.notnull === 0;

    const defaultVal =
      !isNullable && (columnInfo.dflt_value === null || columnInfo.dflt_value === undefined)
        ? this.getDefaultRenderedValueForType(type)
        : columnInfo.dflt_value;

    return {
      type,
      name: columnInfo.name,
      isPrimaryKey: columnInfo.pk === 1,
      defaultVal,
      isNullable
    } as IProperty;
  }
}
