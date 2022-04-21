import Conf from 'conf';
import { IDb2ObjectionConfig } from '..';
import { Db2ObjectionOpts } from '../bin';

export const CONF_CONFIG = 'config';
export const CONF_COMMAND_OPTIONS = 'command-options';
export const CONF_COMMAND_ARGS = 'command-args';
export const CONF_DATABASE = 'database';

const conf = new Conf();

const appData = {
  get(key: string) {
    return conf.get(key);
  },

  set(key: string, value: any) {
    conf.set(key, value);
  },

  getCommandOptions(): Db2ObjectionOpts | undefined {
    return <Db2ObjectionOpts>this.get(CONF_COMMAND_OPTIONS);
  },

  getConfig(): IDb2ObjectionConfig {
    return <IDb2ObjectionConfig>this.get(CONF_CONFIG);
  },

  setDatabase(database: string) {
    conf.set(CONF_DATABASE, database);
  },

  getDatabase(): string | unknown {
    return this.get(CONF_DATABASE);
  }
};

export default appData;
