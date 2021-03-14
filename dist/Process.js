"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Process = void 0;
const chalk_1 = __importDefault(require("chalk"));
const version = require('../package.json').version;
class Process {
    constructor(filename, params, filenameOut) {
        this.filename = filename;
        this.filenameOut =
            filenameOut || (filename.includes('.gpx') ? filename.replace('.gpx', '.out.gpx') : `${filename}.out.gpx`);
        this.stdout = params.stdout;
    }
    run() {
        return new Promise((resolved, _rejected) => {
            console.log(`${chalk_1.default.cyan('🗺  gap2gpx')} ${chalk_1.default.whiteBright(version)}`);
            if (this.stdout) {
                console.log(`parsing to stdOut`);
            }
            else {
                console.log(`parsing: ${this.filename} to output: ${this.filenameOut}`);
            }
            resolved(1);
        });
    }
}
exports.Process = Process;
//# sourceMappingURL=Process.js.map