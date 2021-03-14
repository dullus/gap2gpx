"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Process = void 0;
const U = __importStar(require("./utils"));
const fs_1 = __importDefault(require("fs"));
const chalk_1 = __importDefault(require("chalk"));
const version = require('../package.json').version;
class Process {
    constructor(filename, params, filenameOut) {
        this.track = [];
        this.lastParent = '';
        this.level = -1;
        this.filename = filename;
        this.filenameOut = filenameOut || filename.replace('.json', '.gpx');
        this.stdout = params.stdout;
    }
    run() {
        return new Promise((resolved, rejected) => {
            console.log(`${chalk_1.default.cyan('🗺  gap2gpx')} ${chalk_1.default.whiteBright(version)}`);
            if (this.stdout) {
                console.log(`parsing to stdout`);
            }
            else {
                console.log(`parsing: ${this.filename} to output: ${this.filenameOut}`);
                this.readRunGap()
                    .then(() => this.extractTrack())
                    .then(() => this.fw = fs_1.default.createWriteStream(this.filenameOut, { encoding: 'utf8' }))
                    .then(() => this.convertTrack())
                    .then(() => resolved())
                    .catch((txt) => {
                    this.errorHandler(txt);
                    rejected();
                });
            }
        });
    }
    errorHandler(err) {
        console.error(chalk_1.default.red(`⚠️  Error: ${err}`));
    }
    readRunGap() {
        console.log(chalk_1.default.cyan(`Input file read`));
        return new Promise((resolve, reject) => {
            fs_1.default.readFile(this.filename, 'utf8', (err, data) => {
                if (err) {
                    reject(err.message);
                }
                else {
                    this.trackRaw = JSON.parse(data);
                    console.log(chalk_1.default.cyan(`...done`));
                    resolve();
                }
            });
        });
    }
    extractTrack() {
        console.log(chalk_1.default.cyan(`Extracting track points`));
        return new Promise((resolve, reject) => {
            if (this.trackRaw) {
                this.trackRaw.laps.forEach((lap) => {
                    lap.points.forEach((point) => {
                        if (U.isInterface(point, ['lat', 'lon', 'time', 'ele'])) {
                            this.track.push({
                                ele: point.ele,
                                lat: point.lat,
                                lon: point.lon,
                                time: new Date(point.time * 1000)
                            });
                        }
                    });
                });
                console.log(chalk_1.default.cyan(`...done`));
                resolve();
            }
            else {
                reject('nothing to parse');
            }
        });
    }
    convertTrack() {
        console.log(chalk_1.default.cyan(`Converting track points`));
        return new Promise((resolve, _reject) => {
            var _a;
            this.putHeader();
            this.lastParent = 'trkseg';
            this.level = 3;
            this.track.forEach((point) => {
                this.putTag('trkpt', { 'lon': point.lon.toFixed(6), 'lat': point.lat.toFixed(6) }, false);
                this.lastParent = 'trkpt';
                this.level = 4;
                this.putTag('ele', undefined, false);
                this.putText(point.ele.toFixed(6));
                this.lastParent = 'ele';
                this.putTag('ele', undefined, true);
                this.putTag('time', undefined, false);
                this.putText(point.time.toISOString().replace('.000Z', 'Z'));
                this.lastParent = 'time';
                this.putTag('time', undefined, true);
                this.level = 3;
                this.lastParent = 'trkseg';
                this.putTag('trkpt', undefined, true);
            });
            this.level = 2;
            this.lastParent = 'trk';
            this.putTag('trkseg', undefined, true);
            this.level = 1;
            this.lastParent = 'gpx';
            this.putTag('trk', undefined, true);
            this.level = 0;
            this.lastParent = '';
            this.putTag('gpx', undefined, true);
            (_a = this.fw) === null || _a === void 0 ? void 0 : _a.close();
            console.log(chalk_1.default.cyan(`...done`));
            resolve();
        });
    }
    putHeader() {
        const date = (new Date()).toISOString();
        this.putText(`<?xml version="1.0" encoding="utf-8"?>
<gpx xmlns="http://www.topografix.com/GPX/1/1"
  xmlns:gpxx="http://www.garmin.com/xmlschemas/GpxExtensions/v3"
  xmlns:gpxtrkx="http://www.garmin.com/xmlschemas/TrackStatsExtension/v1"
  xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" version="1.1" creator="gap2gpx"
  xsi:schemaLocation="http://www.topografix.com/GPX/1/1 http://www.topografix.com/GPX/1/1/gpx.xsd http://www.garmin.com/xmlschemas/GpxExtensions/v3 http://www8.garmin.com/xmlschemas/GpxExtensionsv3.xsd http://www.garmin.com/xmlschemas/TrackStatsExtension/v1 http://www8.garmin.com/xmlschemas/TrackStatsExtension.xsd">
  <metadata>
    <name>Untitled Document</name>
    <link href="http://www.garmin.com"></link>
    <time>${date}</time>
  </metadata>
  <trk>
    <name>${date}</name>
    <extensions>
      <gpxx:TrackExtension>
        <gpxx:DisplayColor>DarkMagenta</gpxx:DisplayColor>
      </gpxx:TrackExtension>
    </extensions>
    <trkseg>`);
    }
    putText(txt) {
        if (this.fw) {
            this.fw.write(txt);
        }
        else {
            process.stdout.write(txt);
        }
    }
    putTag(name, attrs, closing = false) {
        const { levelMinus, tag } = U.createTag({
            attrs,
            closing,
            lastParent: this.lastParent,
            level: this.level,
            name
        });
        if (levelMinus) {
            this.level--;
        }
        this.putText(tag);
    }
}
exports.Process = Process;
//# sourceMappingURL=Process.js.map