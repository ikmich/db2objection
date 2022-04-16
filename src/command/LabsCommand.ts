import { BaseCmd } from 'cliyargs';
import { DbObjectionOpts } from '../cli';
import { configUtil } from '../util/config.util';

export class LabsCommand extends BaseCmd<DbObjectionOpts> {
  async run() {
    // labConfigUtil();
  }
}

function labConfigUtil() {
  console.log('[labs: configUtil]');
  const config = configUtil.getConfig();
  console.log('config', config);
}

