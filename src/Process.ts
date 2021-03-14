import * as I from './interfaces';
import chalk from 'chalk';

const version = require('../package.json').version;

export class Process {
  private filename: string;
  private filenameOut: string;
  private stdout: boolean;

  constructor(filename: string, params: I.Params, filenameOut?: string) {
    this.filename = filename;
    this.filenameOut =
      filenameOut || (filename.includes('.gpx') ? filename.replace('.gpx', '.out.gpx') : `${filename}.out.gpx`);
    this.stdout = params.stdout;
  }

  public run(): Promise<number> {
    return new Promise<number>((resolved, _rejected) => {
      console.log(`${chalk.cyan('🗺  gap2gpx')} ${chalk.whiteBright(version)}`);
      if (this.stdout) {
        console.log(`parsing to stdOut`);
      } else {
        console.log(`parsing: ${this.filename} to output: ${this.filenameOut}`);
      }
      resolved(1);
    });
  }
}
