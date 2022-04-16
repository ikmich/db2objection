import { CONFIG_FILENAME, DEFAULT_MODELS_DIRNAME, IConfig } from '../index';
import { filex } from '../libs/filex';
import Path from 'path';

export const configUtil = {
  getConfigFile() {
    return filex.path(process.cwd(), CONFIG_FILENAME);
  },

  getConfig(): IConfig {
    return filex.read({
      file: filex.path(process.cwd(), CONFIG_FILENAME),
      expectJson: true
    });
  },

  getPropKnex() {
    return this.getConfig().knex;
  },

  getPropIgnoreTables() {
    return this.getConfig().ignoreTables;
  },

  getPropModelsOutputDir() {
    return this.getConfig().modelsOutputDir || DEFAULT_MODELS_DIRNAME;
  },

  getModelsOutputDirPath() {
    return filex.path(process.cwd(), this.getPropModelsOutputDir());
  }
};
export const hostConfigFile = Path.join(process.cwd(), CONFIG_FILENAME);
