import FS from 'fs-extra';

export type FileWriteParams = {
  data?: string | Array<any> | object;
  file: string;
};
export type FileReadParams = {
  file: string;
  expectJson?: boolean;
};

/**
 * Utility object for file functions.
 */
export const filer = {
  exists(file: string) {
    return FS.existsSync(file);
  },

  write(params: FileWriteParams) {
    let { file, data } = params;
    if (!file) return;

    let _data = (() => {
      if (!data) {
        return '';
      }

      if (typeof data !== 'string') {
        return JSON.stringify(data, null, 2);
      }

      return data;
    })();

    FS.ensureFileSync(file);
    FS.writeFileSync(file, _data, { encoding: 'utf-8' });
  },

  read(params: FileReadParams) {
    let { file, expectJson } = params;
    if (!file) return;

    const fileExists = FS.existsSync(file);

    if (fileExists) {
      if (expectJson) {
        return require(file);
      } else {
        return FS.readFileSync(file, { encoding: 'utf-8' });
      }
    } else {
      return null;
    }
  },

  deleteFile(file: string) {
    if (FS.existsSync(file)) {
      FS.unlinkSync(file);
    }
  },

  /**
   * Removes a directory and recreates it. All directory contents will be deleted.
   * @param dirPath
   */
  resetDir(dirPath: string) {
    if (FS.existsSync(dirPath)) {
      FS.rmdirSync(dirPath, { recursive: true });
    }
    FS.mkdirSync(dirPath);
  },

  ensureDir(dirPath: string) {
    FS.ensureDirSync(dirPath);
    return dirPath;
  },

  ensureFile(filePath: string) {
    FS.ensureFileSync(filePath);
    return filePath;
  },

  assertFile(file: string, message?: string) {
    if (!FS.existsSync(file)) {
      throw new Error(message ?? `File not found: ${file}`);
    }
  }
};
