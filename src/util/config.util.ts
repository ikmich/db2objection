import { IDb2ObjectionConfig } from '../types.js';
import { filer } from '../libs/filer.js';
import Path from 'path';
import { pathJoin } from './index.js';
import { CONFIG_FILENAME, DEFAULT_MODELS_DIR } from '../consts.js';

export const configUtil = {
  getConfigFile() {
    return pathJoin(process.cwd(), CONFIG_FILENAME);
  },

  getConfigObject(): IDb2ObjectionConfig {
    const file = this.getConfigFile();
    if (!filer.exists(file)) {
      return { knex: { client: '', connection: {} }, modelsOutputDir: '' };
    }

    return filer.read({
      file: this.getConfigFile(),
      expectJson: true
    });
  },

  getIgnoreTablesProperty() {
    return this.getConfigObject().ignoreTables;
  },

  getModelsOutputDirProperty() {
    return this.getConfigObject().modelsOutputDir || DEFAULT_MODELS_DIR;
  }
};
export const hostConfigFile = Path.join(process.cwd(), CONFIG_FILENAME);
