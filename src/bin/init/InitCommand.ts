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

    const configFileContents = `
/* 
 It is recommended to keep db connection parameters in a hidden .env environment variables file that is not added to 
 source version control (git, etc). This config file uses the 'dotenv' library to handle this. 
 
 Please run "npm install dotenv" if it's not installed. 
 */

require('dotenv').config({
  path: '.env'
});

module.exports = {
  /**
   * Knex configurations.
   */
  knex: {
    client: 'sqlite',
    connection: {
      database: process.env.DB_NAME,
      host: process.env.DB_HOST,
      port: process.env.DB_PORT,
      user: process.env.DB_USER,
      password: ''
    }
  },

  modelsOutputDir: 'src/obj-models', // Relative path where the objection models should be saved.

  ignoreTables: [], // Tables to be ignored. e.g. migration tables and other tables used by frameworks.
  
  case: 'camel' // 'camel' | 'snake' | 'ignore'
};`;

    filer.write({
      data: configFileContents,
      file: configFile
    });

    logNotice(`${CONFIG_FILENAME} created.`);
  }
}
