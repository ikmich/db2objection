import { BaseCmd } from 'cliyargs';
import { Db2ObjectionOpts } from './index';
import { configUtil } from '../util/config.util';

export class LabsCommand extends BaseCmd<Db2ObjectionOpts> {
  async run() {
    // labConfigUtil();

    console.log('-> labs');

    console.log('-> options.table:', this.options.table);
    // console.log('-> options.tables:', this.options.tables);
    // console.log('-> typeof options.tables:', typeof this.options.tables);
  }
}

function labConfigUtil() {
  console.log('[labs: configUtil]');
  const config = configUtil.getConfig();
  console.log('config', config);
}
