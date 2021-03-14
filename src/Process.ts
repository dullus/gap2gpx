import * as I from './interfaces/common';
import { FRunGap, PointBase } from './interfaces/rungap';
import * as U from './utils';
import fs from 'fs';
import chalk from 'chalk';

const version = require('../package.json').version;

export class Process {
  public trackRaw: FRunGap | undefined;
  public track: I.TrackPoint[] = [];

  private filename: string;
  private filenameOut: string;
  private fw?: fs.WriteStream;
  private lastParent: string = '';
  private level: number = -1;
  private stdout: boolean;

  constructor(filename: string, params: I.Params, filenameOut?: string) {
    this.filename = filename;
    this.filenameOut = filenameOut || filename.replace('.json', '.gpx');
    this.stdout = params.stdout;
  }

  public run(): Promise<void> {
    return new Promise<void>((resolved, rejected) => {
      console.log(`${chalk.cyan('🗺  gap2gpx')} ${chalk.whiteBright(version)}`);
      if (this.stdout) {
        console.log(`parsing to stdout`);
      } else {
        console.log(`parsing: ${this.filename} to output: ${this.filenameOut}`);
        this.readRunGap()
          .then(() => this.extractTrack())
          .then(() => this.fw = fs.createWriteStream(this.filenameOut, { encoding: 'utf8' }))
          .then(() => this.convertTrack())
          .then(() => resolved())
          .catch((txt: string) => {
            this.errorHandler(txt);
            rejected();
          });
      }
    });
  }

  private errorHandler(err: string): void {
    console.error(chalk.red(`⚠️  Error: ${err}`));
  }

  private readRunGap(): Promise<void> {
    console.log(chalk.cyan(`Input file read`));
    return new Promise<void>((resolve, reject) => {
      fs.readFile(this.filename, 'utf8', (err, data) => {
        if (err) {
          reject(err.message);
        } else {
          this.trackRaw = JSON.parse(data) as FRunGap;
          console.log(chalk.cyan(`...done`));
          resolve();
        }
      });
    });
  }

  private extractTrack(): Promise<void> {
    console.log(chalk.cyan(`Extracting track points`));
    return new Promise<void>((resolve, reject) => {
      if (this.trackRaw) {
        this.trackRaw.laps.forEach((lap) => {
          lap.points.forEach((point: unknown) => {
            if (U.isInterface<PointBase>(point, ['lat', 'lon', 'time', 'ele'])) {
              this.track.push({
                ele: point.ele,
                lat: point.lat,
                lon: point.lon,
                time: new Date(point.time * 1000)
              });
            }
          });
        });
        console.log(chalk.cyan(`...done`));
        resolve();
      } else {
        reject('nothing to parse');
      }
    });
  }

  private convertTrack(): Promise<void> {
    console.log(chalk.cyan(`Converting track points`));
    return new Promise<void>((resolve, _reject) => {
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
      this.fw?.close();
      console.log(chalk.cyan(`...done`));
      resolve();
    });
  }

  private putHeader():void {
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

  private putText(txt: string): void {
    if (this.fw) {
      this.fw.write(txt);
    } else {
      process.stdout.write(txt);
    }
  }

  private putTag(name: string, attrs: I.Attrs | undefined, closing = false): void {
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
