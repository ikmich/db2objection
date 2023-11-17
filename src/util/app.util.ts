import appData from './app-data.js';
import { pathJoin } from './index.js';
import { filer } from '../libs/filer.js';
import { configUtil } from './config.util.js';
import { DEFAULT_MODELS_DIR } from '../consts.js';

export const appUtil = {
  resolveModelsOutputDirPath(): string {
    const projectRoot = appData.getProjectRoot();
    const dirStubFromCli = appData.getCommandOptions()?.dir;

    if (dirStubFromCli && dirStubFromCli.trim()) {
      const dirPath = pathJoin(projectRoot, dirStubFromCli.trim());
      filer.ensureDir(dirPath);
      return dirPath;
    }

    const pathFromConfig = pathJoin(process.cwd(), configUtil.getModelsOutputDirProperty());
    if (filer.exists(pathFromConfig)) {
      return pathFromConfig;
    }
    return pathJoin(projectRoot, DEFAULT_MODELS_DIR);
  }
};