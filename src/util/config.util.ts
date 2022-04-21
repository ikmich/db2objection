import { CONFIG_FILENAME, DEFAULT_MODELS_DIRNAME, IDb2ObjectionConfig } from '../index';
import { filer } from '../libs/filer';
import Path from 'path';
import { _path } from './index';

export const configUtil = {
  getConfigFile() {
    return _path(process.cwd(), CONFIG_FILENAME);
  },

  getConfig(): IDb2ObjectionConfig {
    return filer.read({
      file: _path(process.cwd(), CONFIG_FILENAME),
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

  getPropCamelCase() {
    return this.getConfig().camelCase;
  },

  getModelsOutputDirPath() {
    return _path(process.cwd(), this.getPropModelsOutputDir());
  }
};
export const hostConfigFile = Path.join(process.cwd(), CONFIG_FILENAME);
