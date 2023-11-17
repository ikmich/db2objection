import { configUtil } from '../../util/config.util.js';
import { filer } from '../../libs/filer.js';
import { CONFIG_FILENAME } from '../../consts.js';
import { BaseCommand } from '../base.command.js';
import { logNotice } from '../../util/log.util.js';

export class InitCommand extends BaseCommand {
  async run() {

    const configFile = configUtil.getConfigFile();

    if (!this.options.resetConfig) {
      if (filer.exists(configFile)) {
        logNotice(`${CONFIG_FILENAME} already exists.`);
        return;
      }
    } else {
      filer.deleteFile(configFile);
    }

    const configFileContents = `module.exports = {
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

  modelsOutputDir: '', // Relative path where the objection models should be saved.

  ignoreTables: [], // Tables to be ignored. e.g. migration tables and other tables used by frameworks.
  
  // case: 'camel' // 'camel' | 'snake' | 'ignore'
};`;

    filer.write({
      data: configFileContents,
      file: configFile
    });

    console.log(`${CONFIG_FILENAME} created.`);
  }
}
