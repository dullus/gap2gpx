export interface Metadata {
  HKIndoorWorkout: string;
  HKAverageMETs: string;
}

export interface PointBase {
  lat: number;
  lon: number;
  time: number;
  ele: number;
}

export interface Point extends PointBase {
  va: number;
  ha: number;
  kcal?: number;
  hr?: number;
  runcad?: number;
  dist?: number;
}

export interface Lap {
  points: Array<Point | PointBase>;
}

export interface Source {
  name: string;
  version: string;
  productType: string;
}

export interface FRunGap {
  metadata: Metadata;
  laps: Lap[];
  source: Source;
}
