#!/usr/bin/env node
import { Command } from 'commander';
import { CONFIG_FILENAME } from '../consts.js';
import { GenerateCommand } from './GenerateCommand.js';
import { InitCommand } from './init/InitCommand.js';
import appData from '../util/app-data.js';
import { TestConnectionCommand } from './TestConnectionCommand.js';

export const CMD_INIT = 'init';
export const CMD_GENERATE = 'generate';
export const CMD_GEN = 'gen';
export const CMD_TEST_CONNECTION = 'test-connection';
export const CMD_LABS = 'labs';

export type NamingCase = 'camel' | 'snake' | 'ignore';

export interface Db2ObjOpts {
  resetConfig?: boolean;
  table?: string | string[];
  pojo?: boolean;
  database?: string;
  case?: NamingCase;
  dir?: string;
  scope?: string;
}

const program = new Command();

program
  .description('Generate objection.js models or plain object models from database tables.')
  // .option('-p, --path <char>', 'Path relative to project root.')
  .option('-t, --table [tables...]', 'Name of table to generate model for.')
  .option('--reset-config', 'Used with the init command to specify whether to reset the config file if it already exists.')
  .option('-c | --case <char>', '(snake | camel | ignore) Used with the `generate` command to indicate the name case for the generated model properties.')
  .option('--pojo', 'Used with the `generate` command to specify whether plain Typescript model classes will be generated, and not classes extending ObjectionJS Model.')
  .option('--db, --database <char>', 'Specify the database to connect to. This overrides the database value that is set in the config file.')
  .option('--dir <char>', 'Specify target directory path relative to the project root.')
  .option('--scope <char>', 'Used to create a folder namespace for generated models.')
;

program
  .command(CMD_INIT)
  .description(`Generate config file: ${CONFIG_FILENAME} and initialize.`)
  .action(async () => {
    await new InitCommand(program).run();
  });

program
  .command(CMD_GENERATE, { isDefault: true })
  .description('Generate objection models from db')
  .action(async () => {
    await new GenerateCommand(program).run();
  });

program
  .command(CMD_GEN)
  .description(`Alias for '${CMD_GENERATE}'`)
  .action(async () => {
    await new GenerateCommand(program).run();
  });

program
  .command(CMD_TEST_CONNECTION)
  .description(`Test the database connection.`)
  .action(async () => {
    await new TestConnectionCommand(program).run();
  });


program.parse();

appData.setProjectRoot(process.cwd());