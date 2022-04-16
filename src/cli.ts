#!/usr/bin/env node

import { cliyargs, CmdInfo, BaseCmdOpts } from 'cliyargs';
import { CONFIG_FILENAME } from './index';
import { InitCommand } from './command/InitCommand';
import { GenerateCommand } from './command/GenerateCommand';
import { LabsCommand } from './command/LabsCommand';

export const CMD_INIT = 'init';
export const CMD_GENERATE = 'generate';
export const CMD_GEN = 'gen';
export const CMD_LABS = 'labs';

export interface DbObjectionOpts extends BaseCmdOpts {
  reset?: boolean;
}

const argv = cliyargs.yargs
  // Define the commands
  .command(CMD_INIT, `Generate config file: ${CONFIG_FILENAME} and initialize.`)
  .command(CMD_GENERATE, 'Generate objection models from db')
  .alias({
    gen: 'generate'
  })

  .option('reset', {
    type: 'boolean',
    desc: 'Whether to apply a reset function'
  })

  // Enable the 'help' command for your cli app
  .help().argv;

const commandInfo: CmdInfo<DbObjectionOpts> = cliyargs.getCommandInfo(argv);

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
      await new LabsCommand(commandInfo).run();
      break;

    default:
      /* If no command is passed, perform the 'generate' command. */
      await new GenerateCommand(commandInfo).run();
      break;
  }
});
