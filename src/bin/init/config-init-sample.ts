import { IDb2ObjectionConfig } from '../../index';

const config: IDb2ObjectionConfig = {
  /**
   * Knex configuration.
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
   * overwritten when the `generate` command is run.
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
};
