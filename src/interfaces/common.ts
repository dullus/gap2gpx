export interface Attrs {
  [key: string]: string;
}

export interface Params {
  stdout: boolean;
}

export interface ParserStream extends NodeJS.EventEmitter, NodeJS.WritableStream {}

export interface TagOptions {
  attrs: Attrs | undefined;
  closing: boolean;
  lastParent: string;
  level: number;
  name: string;
}

export interface TrackPoint {
  ele: number;
  lat: number;
  lon: number;
  time: Date;
} 