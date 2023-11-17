import Path from 'path';

export const CONFIG_FILENAME = 'db2objection.config.cjs';
export const DEFAULT_MODELS_DIRNAME = 'db2objection-models';
export const DEBUG_DIRNAME = 'db2objection-debug';
export const DEBUG_DIR_PATH = Path.join(process.cwd(), DEBUG_DIRNAME);