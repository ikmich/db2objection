import { Command } from 'commander';
import { Db2ObjOpts } from './index.js';

export abstract class BaseCommand {
  protected options: Db2ObjOpts = {};
  protected args?: string[];

   constructor(protected readonly command: Command) {
    this.options = command.opts<Db2ObjOpts>();
    this.args = command.args;
  }
}