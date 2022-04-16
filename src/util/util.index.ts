import { filex } from '../libs/filex';
import { DEBUG_DIRNAME } from '../index';

export const DEBUG_DIR_PATH = filex.path(process.cwd(), DEBUG_DIRNAME);

const DEV_ENVIRONMENTS = ['development', 'dev', 'local'];

function isDevEnvironment() {
  return process.env.NODE_ENV && DEV_ENVIRONMENTS.includes(process.env.NODE_ENV);
}

export function _debug(fn: () => any) {
  if (isDevEnvironment()) {
    fn();
  }
}
