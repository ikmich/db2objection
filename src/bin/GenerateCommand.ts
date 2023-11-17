// noinspection JSMethodCanBeStatic

import knex, { Knex } from 'knex';
import { DbParser } from '../parser/DbParser.js';
import { MysqlParser } from '../parser/MysqlParser.js';
import { modelGenerator } from '../generator/model-generator.js';
import { filer } from '../libs/filer.js';
import { configUtil, hostConfigFile } from '../util/config.util.js';
import pluralize from 'pluralize';
import { SqliteParser } from '../parser/SqliteParser.js';
import { PostgresParser } from '../parser/PostgresParser.js';
import appData from '../util/app-data.js';
import { CONFIG_FILENAME } from '../consts.js';
import { BaseCommand } from './base.command.js';
import { logError } from '../util/log.util.js';
import { appUtil } from '../util/app.util.js';
import ConnectionConfig = Knex.ConnectionConfig;

export class GenerateCommand extends BaseCommand {

  private resolveDatabase(): string {
    const confDatabase = (configUtil.getConfigObject().knex.connection as ConnectionConfig).database;
    const optsDatabase = this.options.database;

    /* database from cli option flag should take precedence. */
    if (optsDatabase) {
      return optsDatabase;
    }
    return confDatabase || '';
  }

  async run(): Promise<void> {

    if (!filer.exists(hostConfigFile)) {
      console.error(`File not found: ${CONFIG_FILENAME}. Have you run \`$ db2obj init\`?`);
      return;
    }

    const config = configUtil.getConfigObject();

    if (!config.knex) {
      console.error('ERROR - Missing `knex` configuration property');
      return;
    }

    // store config
    appData.saveConfig(config);

    let usingSqliteClient = ['sqlite', 'sqlite3', 'better-sqlite'].includes(config.knex.client);

    /* If no database value is set in the config file, check the 'database' option passed in command */
    const resolvedDatabase = this.resolveDatabase();

    // If no database option, throw error. There must be a database to work with.
    if (!usingSqliteClient && !resolvedDatabase) {
      logError(
        `ERROR - No database to work with. Set database in ${CONFIG_FILENAME} or with the --database flag`
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

    /* Process naming case. Default to camel case. */
    this.options.case = this.options.case ? this.options.case : (config.case || 'camel');

    // store options
    appData.saveCommandOptions(this.options);
    appData.saveCommandArgs(this.args);

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
          const msg = 'Supported knex connection client for db parser not found';
          console.error(`ERROR! ${msg}`);
          throw new Error(msg);
      }
    })();

    // const modelsDirName = configUtil.getModelsOutputDirProperty();

    try {
      const modelDescriptors = await dbParser.buildModelDescriptors(selectTables);

      // generate objection models
      modelGenerator.generate(modelDescriptors);

      const outputDirPath = appUtil.resolveModelsOutputDirPath();
      const projectRoot = appData.getProjectRoot();
      const relPath = outputDirPath.replace(new RegExp(`^${projectRoot}(/*)`), '')
        .replace(/\/*$/, '/');

      const num = modelDescriptors.length;
      console.log(`${num} ${pluralize('model', num)} generated in "${relPath}".`);
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
