import { BaseCommand } from './base.command.js';
import { configUtil } from '../util/config.util.js';
import knex from 'knex';
import { logError, logSuccess } from '../util/log.util.js';

export class TestConnectionCommand extends BaseCommand {

  async run(): Promise<void> {
    try {

      const db = knex(configUtil.getConfigObject().knex);
      const { result } = await db.select(db.raw(`'test output' as result`)).first();

      if (result === 'test output') {
        logSuccess('ok');
      }

      process.exit(0);
    } catch (e) {
      logError(e);
      process.exit(-1);
    }
  }
}