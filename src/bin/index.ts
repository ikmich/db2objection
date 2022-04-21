#!/usr/bin/env node

import { BaseCmdOpts, cliyargs, CmdInfo } from 'cliyargs';
import { CONFIG_FILENAME } from '../index';
import { InitCommand } from './init/InitCommand';
import { GenerateCommand } from './GenerateCommand';
import { LabsCommand } from './LabsCommand';
import { _debug } from '../util';

export const CMD_INIT = 'init';
export const CMD_GENERATE = 'generate';
export const CMD_GEN = 'gen';
export const CMD_LABS = 'labs';

export interface Db2ObjectionOpts extends BaseCmdOpts {
  reset?: boolean;
  table?: string | string[];
  pojo?: boolean;
  database?: string;
  camelCase?: boolean;
}

const argv = cliyargs.yargs
  // Define the commands
  .command(CMD_INIT, `Generate config file: ${CONFIG_FILENAME} and initialize.`)
  .command(CMD_GENERATE, 'Generate objection models from db')
  .command(CMD_GEN, `Alias for '${CMD_GENERATE}'`)

  .option('reset', {
    type: 'boolean',
    desc: 'Used with the init command to specify whether to reset the config file if it already exists'
  })

  .option('table', {
    type: 'string',
    desc: 'Name of table to generate model for. Set this option multiple times to specify an array of tables.'
  })

  .option('camelCase', {
    type: 'boolean',
    desc: 'Used with the `generate` command to specify whether the model properties should be printed in camel case'
  })

  .option('pojo', {
    type: 'boolean',
    desc: 'Used with the `generate` command to specify whether plain Typescript model classes will be generated, and not classes extending ObjectionJS Model'
  })

  .option('database', {
    type: 'string',
    alias: 'db',
    desc: 'Used with the `generate` command to specify the database to connect to. This overrides the database value that is set in the config file'
  })

  // Enable the 'help' command for your cli app
  .help().argv;

const commandInfo: CmdInfo<Db2ObjectionOpts> = cliyargs.getCommandInfo(argv);

cliyargs.processCommand(commandInfo, async (commandName) => {
  // Execute code depending on the provided command name
  switch (commandName) {
    case CMD_INIT:
      await new InitCommand(commandInfo).run();
      break;

    case CMD_GENERATE:
    case CMD_GEN:
      await new GenerateCommand(commandInfo).run();
      break;

    case CMD_LABS:
      await _debug(async () => {
        await new LabsCommand(commandInfo).run();
      });

      break;

    default:
      /* If no command is passed, perform the 'generate' command. */
      await new GenerateCommand(commandInfo).run();
      break;
  }
});
