import Path from 'path';
import { fileURLToPath } from 'url';
import { config } from 'dotenv';
import { DEBUG_DIR_PATH } from '../consts.js';
import pluralize from 'pluralize';
const { singular } = pluralize;


const __filename = fileURLToPath(import.meta.url);
const __dirname = Path.dirname(__filename);
export const ENV_PATH = Path.join(__dirname, '../../.env');

export function captureEnv() {
  config({
    path: ENV_PATH
  });
}

captureEnv();

const DEV_ENVIRONMENTS = ['development', 'dev', 'local'];

export function isDevEnvironment() {
  return process.env.LIB_ENV && DEV_ENVIRONMENTS.includes(process.env.LIB_ENV);
}

export function _fn(fn: () => unknown) {
  return fn();
}

export function _debug(fn: () => any) {
  if (isDevEnvironment()) {
    fn();
  }
}

/**
 * Join paths using node 'path' module.
 * @param paths
 */
export const pathJoin = (...paths: string[]) => {
  return Path.join(...paths);
};

export function getDebugFilePath(filename: string) {
  return Path.join(DEBUG_DIR_PATH, filename);
}

export const libUtils = {
  singular(word: string) {
    const lower = word.toLowerCase();
    switch (true) {
      case lower === 'data':
      case lower.endsWith('data'):

        return word;
    }
    return singular(word);
  }
};