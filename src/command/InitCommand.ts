import { BaseCmd } from 'cliyargs';
import { CONFIG_FILENAME, IConfig } from '../index';
import { DbObjectionOpts } from '../cli';
import { configUtil } from '../util/config.util';
import { filex } from '../libs/filex';

export class InitCommand extends BaseCmd<DbObjectionOpts> {
  async run() {
    await super.run();

    // const configFile = Path.join(process.cwd(), CONFIG_FILENAME);
    const configFile = configUtil.getConfigFile();

    if (!this.options.reset) {
      if (filex.exists(configFile)) {
        console.log(`${CONFIG_FILENAME} already exists.`);
        return;
      }
    } else {
      filex.deleteFile(configFile);
    }

    const initContents = `module.exports = {
  /**
   * Knex configurations.
   */
  knex: {
    client: '',
    connection: {
      database: '',
      host: '',
      port: 0,
      user: '',
      password: ''
    }
  },

  /**
   * Relative path where the objection models should be saved.
   */
  modelsOutputDir: '',

  ignoreTables: []
};`;
    filex.write({
      data: initContents,
      file: configFile
    });
  }
}

const config: IConfig = {
  /**
   * Knex configurations.
   */
  knex: {
    client: '',
    connection: {
      database: '',
      host: '',
      port: 0,
      user: '',
      password: ''
    }
  },

  /**
   * Relative path where the objection models should be saved.
   */
  modelsOutputDir: '',

  ignoreTables: []
};
