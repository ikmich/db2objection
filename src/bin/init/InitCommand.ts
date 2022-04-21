import { BaseCmd } from 'cliyargs';
import { CONFIG_FILENAME } from '../../index';
import { Db2ObjectionOpts } from '../index';
import { configUtil } from '../../util/config.util';
import { filer } from '../../libs/filer';

export class InitCommand extends BaseCmd<Db2ObjectionOpts> {
  async run() {
    await super.run();

    const configFile = configUtil.getConfigFile();

    if (!this.options.reset) {
      if (filer.exists(configFile)) {
        console.log(`${CONFIG_FILENAME} already exists.`);
        return;
      }
    } else {
      filer.deleteFile(configFile);
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
   * Relative path where the objection models should be saved. Be careful, as the contents of this directory will be
   * overwritten when the \`generate\` command is run.
   */
  modelsOutputDir: '',

  /**
   * Tables for which models will not be generated.
   */
  ignoreTables: [],
  
  /**
   * Set to 'true' to use camelCase for the generated model properties
   */
  camelCase: false
};`;

    filer.write({
      data: initContents,
      file: configFile
    });

    console.log(`${CONFIG_FILENAME} created.`);
  }
}
