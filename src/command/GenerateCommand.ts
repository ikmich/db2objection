// noinspection JSMethodCanBeStatic

import { BaseCmd } from 'cliyargs';
import { CONFIG_FILENAME, IConfig } from '../index';
import { DbObjectionOpts } from '../cli';
import knex from 'knex';
import { DbParser } from '../parser/db-parser';
import { MysqlParser } from '../parser/mysql-parser';
import { modelGenerator } from '../generator/model-generator';
import { filex } from '../libs/filex';
import { configUtil, hostConfigFile } from '../util/config.util';
import { conprint } from 'cliyargs/dist/utils';
import pluralize from 'pluralize';

export class GenerateCommand extends BaseCmd<DbObjectionOpts> {
  async run(): Promise<void> {
    await super.run();

    filex.assertFile(hostConfigFile, `File not found: ${CONFIG_FILENAME}. Have you run 'db-objection init?`);

    const config: IConfig = require(hostConfigFile);
    if (!config.knex) {
      throw new Error('Missing `knex` configuration property');
    }

    const knexInstance = knex({
      connection: config.knex.connection,
      client: config.knex.client
    });

    const dbParser: DbParser = (() => {
      switch (config.knex.client) {
        case 'mysql':
        case 'mysql2':
          return new MysqlParser(knexInstance);

        // case 'pg':
        // case 'postgres':
        //   return new PostgresParser(knexInstance);

        // case 'sqlite':
        // case 'sqlite3':
        //   return new SqliteParser(knexInstance);
        default:
          throw new Error('Valid client for db parser not found');
      }
    })();

    try {
      const modelDescriptors = await dbParser.buildModelDescriptors();

      // [generate objection models]
      modelGenerator.generate(modelDescriptors);

      const num = modelDescriptors.length;
      conprint.success(`${num} ${pluralize('model', num)} generated in ${configUtil.getModelsOutputDirPath()}.`);
    } catch (e) {
      console.error(e);
      process.exit(-1);
    }

    this.exit();
  }

  private exit(code?: number) {
    process.exit(code === undefined ? 0 : code);
  }
}
