import Conf from 'conf';
import { IDb2ObjectionConfig } from '../types.js';
import { Db2ObjOpts } from '../bin/index.js';

const conf_config = 'config';
const conf_command_options = 'command-options';
const conf_command_args = 'command-args';
const conf_database = 'database';
const key_project_root = 'project-root';

const conf = new Conf({
  projectName: 'db2objection'
});

const appData = {
  get(key: string) {
    return conf.get(key);
  },

  set(key: string, value: any) {
    conf.set(key, value);
  },

  getProjectRoot(): string {
    return (this.get(key_project_root) || process.cwd()) as string;
  },

  setProjectRoot(path: string) {
    this.set(key_project_root, path);
  },

  getCommandOptions(): Db2ObjOpts | undefined {
    return <Db2ObjOpts>this.get(conf_command_options);
  },

  saveCommandOptions(opts: Db2ObjOpts) {
    this.set(conf_command_options, opts);
  },

  saveCommandArgs(args?: string[]) {
    this.set(conf_command_args, args);
  },

  getCommandArgs(): string[] | undefined {
    let out = this.get(conf_command_args);
    if (out) {
      return out as string[];
    }
    return undefined;
  },

  getConfig(): IDb2ObjectionConfig {
    return <IDb2ObjectionConfig>this.get(conf_config);
  },

  saveConfig(config: IDb2ObjectionConfig) {
    this.set(conf_config, config);
  },

  setDatabase(database: string) {
    conf.set(conf_database, database);
  },

  getDatabase(): string | unknown {
    return this.get(conf_database);
  }
};

export default appData;
