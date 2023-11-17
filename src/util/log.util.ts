import chalk from 'chalk';

export function log(arg0?: any, ...arg1: any[]) {
  console.log(arg0, arg1);
}

export function logError(arg0?: any, ...arg1: any[]) {
  console.error(chalk.red(arg0, arg1));
}

export function logNotice(arg0?: any, ...arg1: any[]) {
  console.log(chalk.yellow(arg0, arg1));
  // console.log(chalk.hex('#FFE500')(arg0, arg1));
}

export function logWarn(arg0?: any, ...arg1: any[]) {
  console.warn(chalk.hex('#FF7A00')(arg0, arg1));
}

export function logSuccess(arg0?: any, ...arg1: any[]) {
  console.log(chalk.greenBright(arg0, arg1));
}

export function logInfo(arg0?: any, ...arg1: any[]) {
  // blueBright
  console.log(chalk.hex('#20cbff')(arg0, arg1));
}