import { Knex } from 'knex';
import { IModel } from '../index';

export interface DbParser {
  getTableNames: () => Promise<string[]>;
  buildModelDescriptors: (selectTables?: string[]) => Promise<IModel[]>;
}

export abstract class BaseDbParser implements DbParser {
  constructor(protected knex: Knex) {}

  abstract getTableNames(): Promise<string[]>;

  abstract buildModelDescriptors(selectTables?: string[]): Promise<IModel[]>;

  static getDefaultRenderedValueForType(type: string) {
    switch (type.toLowerCase()) {
      case 'number':
        return 0;
      case 'string':
        return "''";
      case 'boolean':
        return false;
      case 'object':
        return {};
      case 'date':
        return 'new Date()';
    }
  }

  static getPropertyType(columnTypeValue: string): string {
    if (NUMBER_REGEX.test(columnTypeValue)) {
      return typeof 0;
    } else if (STRING_REGEX.test(columnTypeValue)) {
      return typeof '';
    } else if (DATE_REGEX.test(columnTypeValue)) {
      return 'Date';
    } else if (BOOLEAN_REGEX.test(columnTypeValue)) {
      return typeof false;
    } else if (OBJECT_REGEX.test(columnTypeValue)) {
      return typeof {};
    }

    return 'any';
  }
}

export const NUMBER_REGEX = /^(int|integer|long|signed|unsigned|short|decimal|double|float)/i;
export const STRING_REGEX = /^(varchar|text|char|character|string|mediumtext|longtext|enum)/i;
export const DATE_REGEX = /^(date|time|datetime)/i;
export const BOOLEAN_REGEX = /^(boolean|bool)/i;
export const OBJECT_REGEX = /^(blob|json)/i;
