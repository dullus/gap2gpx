import yargs from 'yargs';
import chalk from 'chalk';
import * as I from './interfaces/common';
import { Process } from './Process';

const options = yargs
  .usage('Usage: -i <infile> [-o <outfile>]')
  .option('i', { alias: 'input', demandOption: true, describe: 'Input file', type: 'string' })
  .option('o', { alias: 'output', demandOption: false, describe: 'Output file', type: 'string' })
  .option('s', { alias: 'stdout', demandOption: false, describe: 'pipe result to stdout', type: 'boolean' }).argv;

const params: I.Params = {
  stdout: options.stdout as boolean
};

const process = new Process(options.input as string, params, options.output as string);
process.run().then(
  () => {
    if (!options.stdout) {
      console.log(chalk.green(`✅ Done.`));
    }
  },
  () => {
    return;
  }
);
