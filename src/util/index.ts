import { DEBUG_DIR_PATH } from '../index';
import Path from 'path';

export const ENV_PATH = Path.join(__dirname, '../../.env');

export function captureEnv() {
  require('dotenv').config({
    path: ENV_PATH
  });
}

captureEnv();

const DEV_ENVIRONMENTS = ['development', 'dev', 'local'];

export function isDevEnvironment() {
  return process.env.LIB_ENV && DEV_ENVIRONMENTS.includes(process.env.LIB_ENV);
}

export function _fn(fn: () => any) {
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
export const _path = (...paths: string[]) => {
  return Path.join(...paths);
};

export function _debugFileRef(filename: string) {
  return Path.join(DEBUG_DIR_PATH, filename);
}
export { CONF_COMMAND_ARGS } from './app-data';
export { CONF_COMMAND_OPTIONS } from './app-data';
