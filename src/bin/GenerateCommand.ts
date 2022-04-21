// noinspection JSMethodCanBeStatic

import { BaseCmd } from 'cliyargs';
import { CONFIG_FILENAME, IDb2ObjectionConfig } from '../index';
import { Db2ObjectionOpts } from './index';
import knex, { Knex } from 'knex';
import { DbParser } from '../parser/DbParser';
import { MysqlParser } from '../parser/MysqlParser';
import { modelGenerator } from '../generator/model-generator';
import { filer } from '../libs/filer';
import { configUtil, hostConfigFile } from '../util/config.util';
import pluralize from 'pluralize';
import { SqliteParser } from '../parser/SqliteParser';
import { conprint } from 'cliyargs/dist/utils';
import { PostgresParser } from '../parser/PostgresParser';
import appData, { CONF_COMMAND_ARGS, CONF_COMMAND_OPTIONS, CONF_CONFIG } from '../util/app-data';
import ConnectionConfig = Knex.ConnectionConfig;

export class GenerateCommand extends BaseCmd<Db2ObjectionOpts> {
  private resolveDatabase(): string {
    const confDatabase = (configUtil.getConfig().knex.connection as ConnectionConfig).database;
    const optsDatabase = this.options.database;
    return confDatabase || optsDatabase || '';
  }

  async run(): Promise<void> {
    await super.run();

    if (!filer.exists(hostConfigFile)) {
      conprint.error(`File not found: ${CONFIG_FILENAME}. Have you run \`$ db2obj init\`?`);
      return;
    }

    const config = configUtil.getConfig();

    if (!config.knex) {
      conprint.error('ERROR - Missing `knex` configuration property');
      return;
    }

    // store config
    appData.set(CONF_CONFIG, config);

    let usingSqliteClient = ['sqlite', 'sqlite3', 'better-sqlite'].includes(config.knex.client);

    /* If no database value is set in the config file, check the 'database' option passed in command */
    const resolvedDatabase = this.resolveDatabase();

    // If no database option, throw error. There must be a database to work with.
    if (!usingSqliteClient && !resolvedDatabase) {
      conprint.error(
        `ERROR - No database to work with. Set database in ${CONFIG_FILENAME} or with the --database command option`
      );
      return;
    }

    // store database name
    appData.setDatabase(resolvedDatabase);

    let knexConfiguration: Knex.Config = {
      connection: {
        ...config.knex.connection,
        database: resolvedDatabase
      },
      client: config.knex.client
    };

    if (usingSqliteClient) {
      knexConfiguration.useNullAsDefault = true;
    }

    if (!this.options.camelCase && typeof config.camelCase !== 'undefined') {
      this.options.camelCase = config.camelCase;
    }

    // store options
    appData.set(CONF_COMMAND_OPTIONS, this.options);
    appData.set(CONF_COMMAND_ARGS, this.args);

    const selectTables = (() => {
      if (typeof this.options.table === 'string') {
        return [this.options.table];
      } else if (Array.isArray(this.options.table)) {
        return this.options.table;
      }
      return;
    })();

    const knexInstance = knex(knexConfiguration);

    const dbParser: DbParser = (() => {
      switch (config.knex.client) {
        case 'mysql':
        case 'mysql2':
          return new MysqlParser(knexInstance);

        case 'pg':
        case 'postgres':
          return new PostgresParser(knexInstance);

        case 'sqlite':
        case 'sqlite3':
        case 'better-sqlite3':
          return new SqliteParser(knexInstance);
        default:
          throw new Error('Valid client for db parser not found');
      }
    })();

    const modelsDirName = configUtil.getPropModelsOutputDir();

    try {
      const modelDescriptors = await dbParser.buildModelDescriptors(selectTables);

      // generate objection models
      modelGenerator.generate(modelDescriptors);

      const num = modelDescriptors.length;
      conprint.success(`${num} ${pluralize('model', num)} generated in "./${modelsDirName}".`);
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
