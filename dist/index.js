"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const yargs_1 = __importDefault(require("yargs"));
const chalk_1 = __importDefault(require("chalk"));
const Process_1 = require("./Process");
const options = yargs_1.default
    .usage('Usage: -i <infile> [-o <outfile>]')
    .option('i', { alias: 'input', demandOption: true, describe: 'Input file', type: 'string' })
    .option('o', { alias: 'output', demandOption: false, describe: 'Output file', type: 'string' })
    .option('s', { alias: 'stdout', demandOption: false, describe: 'pipe result to stdout', type: 'boolean' }).argv;
const params = {
    stdout: options.stdout
};
const process = new Process_1.Process(options.input, params, options.output);
process.run().then(() => {
    if (!options.stdout) {
        console.log(chalk_1.default.green(`✅ Done.`));
    }
}, () => {
    return;
});
//# sourceMappingURL=index.js.map