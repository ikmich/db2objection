import { IModel, IProperty, MysqlColumnInfo } from '../index';
import { BaseDbParser } from './DbParser';
import * as ChangeCase from 'change-case';
import { singular } from 'pluralize';
import { filer } from '../libs/filer';
import { configUtil } from '../util/config.util';
import { _debug, _debugFileRef } from '../util';

export class MysqlParser extends BaseDbParser {
  async getTableNames(): Promise<string[]> {
    const result = await this.knex.raw('SHOW TABLES');

    _debug(() => {
      filer.write({
        data: result,
        file: _debugFileRef(`show-tables.txt`)
      });
    });

    return result[0].map((record: any) => {
      return Object.values(record)[0];
    });
  }

  async buildModelDescriptors(selectTables?: string[]): Promise<IModel[]> {
    let tableNames = await this.getTableNames();

    if (Array.isArray(selectTables)) {
      tableNames = tableNames.filter((table) => selectTables.includes(table));
    }

    const modelDescriptors: IModel[] = [];

    const ignoreList = configUtil.getPropIgnoreTables() || [];

    for (let table of tableNames) {
      if (ignoreList.includes(table)) {
        continue;
      }
      const result = await this.knex.raw(`DESCRIBE ${table}`);

      const mysqlTableInfoList: MysqlColumnInfo[] = result[0];

      _debug(() => {
        filer.write({
          data: mysqlTableInfoList,
          file: _debugFileRef(`describe-${table}.txt`)
        });
      });

      const properties: IProperty[] = [];

      let priColumn: string | undefined = undefined;

      if (mysqlTableInfoList) {
        for (let tableInfo of mysqlTableInfoList) {
          let property = MysqlParser.mapToProperty(tableInfo);
          if (property.isPrimaryKey) {
            priColumn = property.name;
          }
          properties.push(property);
        }
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
        file: _debugFileRef('model-descriptors.txt')
      });
    });

    return modelDescriptors;
  }

  private static mapToProperty(columnInfo: MysqlColumnInfo): IProperty {
    const type = this.getPropertyType(columnInfo.Type);

    const isNullable = columnInfo.Null.toLowerCase() === 'yes' || columnInfo.Null.toLowerCase() !== 'no';

    const defaultVal =
      !isNullable && (columnInfo.Default === null || columnInfo.Default === undefined)
        ? this.getDefaultRenderedValueForType(type)
        : columnInfo.Default;

    return {
      type,
      name: columnInfo.Field,
      isPrimaryKey:
        columnInfo.Key.toLowerCase() === 'pri' ||
        columnInfo.Key.toLowerCase().startsWith('pri') ||
        columnInfo.Key.toLowerCase().startsWith('primary'),
      defaultVal,
      isNullable
    } as IProperty;
  }
}
