# gap2gpx

[![NPM Stats](https://nodei.co/npm/gap2gpx.png)](https://npmjs.org/package/gap2gpx/)

![](https://img.shields.io/badge/version-0.1.0-red)
![](https://img.shields.io/badge/languages-TypeScript-blue)
![](https://img.shields.io/badge/node-%3E%3D10.0.0-brightgreen)
![](https://img.shields.io/badge/npm-%3E%3D6.0.0-brightgreen)

__gap2gpx__ is command line tool for converting internal RunGap json format to GPX track.


## Installation

You can choose to use published version from npmjs.com or directly clone project from GitHub

### Install from NPMJS
```sh
npm install -g gap2gpx
```

### Installation from Git
 - You need [NodeJS](https://nodejs.org/) to be installed on your computer.
 - Clone repository or download zip:
  ```sh
  git clone https://github.com/dullus/gap2gpx.git
  ```
 - Install it
  ```sh
  cd gap2gpx
  npm install -g .
  ```
 - Run it
  ```sh
  gap2gpx --help
  ```
  will output:
  ```txt
  Usage: -i <infile> [-o <outfile>]

  Options:
    --help        Show help                            [boolean]
    --version     Show version number                  [boolean]
    -i, --input   Input file                 [string] [required]
    -o, --output  Output file                           [string]
    -s, --stdout  pipe result to stdout                [boolean]
  ```

## Sample usage

```sh
# Process file some-run.json and save output to some-run.gpx:
gap2gpx -i some-run.json

# Process file some-run.json and output to stdout:
gap2gpx -i some-run.json -s
```

## Uninstall
```sh
npm uninstall -g gap2gpx
```

## API

You can use gap2gpx directly as library without CLI interface in your project.

```ssh
npm install --save gap2gpx
```

Then include in your project (TypeScript example):

```ts
import { Process } from 'gap2gpx/src/Process';
// configure options
const params = {
  stdout: true // matches -s switch
};
// create instance
const process = new Process('input.json', params);
// add some code to capture STDOUT, or use temporary file
...
// run conversion
process.run().then(
  (caches: number) => { /* .. promise resolved handler */ },
  () => { /* .. promise rejected handler */ }
);
```


