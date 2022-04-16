import { ModelDescriptor, MysqlTableInfo, PropertyMeta } from '../index';
import { BaseDbParser } from './db-parser';
import * as ChangeCase from 'change-case';
import { singular } from 'pluralize';
import { filex } from '../libs/filex';
import { configUtil } from '../util/config.util';
import { _debug, DEBUG_DIR_PATH } from '../util/util.index';

export class MysqlParser extends BaseDbParser {
  async getTableNames(): Promise<string[]> {
    const result = await this.knex.raw('SHOW TABLES');

    _debug(() => {
      filex.write({
        data: result,
        file: filex.path(DEBUG_DIR_PATH, `show-tables.txt`)
      });
    });

    return result[0].map((record: any) => {
      return Object.values(record)[0];
    });
  }

  async buildModelDescriptors(): Promise<ModelDescriptor[]> {
    const tableNames = await this.getTableNames();

    const modelDescriptors: ModelDescriptor[] = [];

    const ignoreList = configUtil.getPropIgnoreTables() || [];

    for (let table of tableNames) {
      if (ignoreList.includes(table)) {
        continue;
      }
      const result = await this.knex.raw(`DESCRIBE ${table}`);

      const mysqlTableInfoList: MysqlTableInfo[] = result[0];

      _debug(() => {
        filex.write({
          data: mysqlTableInfoList,
          file: filex.path(DEBUG_DIR_PATH, `describe-${table}.txt`)
        });
      });

      const properties: PropertyMeta[] = [];

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

      const modelDescriptor: ModelDescriptor = {
        modelName: ChangeCase.pascalCase(singular(table)),
        tableName: table,
        idColumn: priColumn,
        modelProperties: properties
      };

      modelDescriptors.push(modelDescriptor);
    }

    _debug(() => {
      filex.write({
        data: modelDescriptors,
        file: filex.path(DEBUG_DIR_PATH, 'model-descriptors.txt')
      });
    });

    return modelDescriptors;
  }

  private static mapToProperty(tableInfo: MysqlTableInfo): PropertyMeta {
    const property: Partial<PropertyMeta> = {
      name: tableInfo.Field,
      defaultVal: tableInfo.Default,
      isPrimaryKey:
        tableInfo.Key.toLowerCase() === 'pri' ||
        tableInfo.Key.toLowerCase().startsWith('pri') ||
        tableInfo.Key.toLowerCase().startsWith('primary')
    };

    // Determine the property type
    const numberRegex = /^(int|long|signed|unsigned|short|decimal|double|float)/;
    const stringRegex = /^(varchar|text|char|string|mediumtext|longtext|date|time|datetime|enum)/;
    const booleanRegex = /^(boolean|bool)/;
    const objectRegex = /^(blob|json)/;

    if (numberRegex.test(tableInfo.Type)) {
      property.type = typeof 0;
    } else if (stringRegex.test(tableInfo.Type)) {
      property.type = typeof '';
    } else if (booleanRegex.test(tableInfo.Type)) {
      property.type = typeof false;
    } else if (objectRegex.test(tableInfo.Type)) {
      property.type = typeof {};
    }

    return property as PropertyMeta;
  }
}
