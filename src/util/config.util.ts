import { IDb2ObjectionConfig } from '../index.js';
import { filer } from '../libs/filer.js';
import Path from 'path';
import { pathJoin } from './index.js';
import { CONFIG_FILENAME, DEFAULT_MODELS_DIRNAME } from '../consts.js';

export const configUtil = {
  getConfigFile() {
    return pathJoin(process.cwd(), CONFIG_FILENAME);
  },

  getConfig(): IDb2ObjectionConfig {
    return filer.read({
      file: pathJoin(process.cwd(), CONFIG_FILENAME),
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
    return pathJoin(process.cwd(), this.getPropModelsOutputDir());
  }
};
export const hostConfigFile = Path.join(process.cwd(), CONFIG_FILENAME);
