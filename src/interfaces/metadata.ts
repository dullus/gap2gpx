export interface StartTime {
  time: string | Date;
}

export interface ActivityType {
  internalId: number;
  internalName: string;
  sourceName: string;
}

export interface StartLocation {
  lat: number;
  lon: number;
}

export interface EndLocation {
  lat: number;
  lon: number;
}

export interface Lap {
  avgCadence: number;
  avgheartrate: number;
  avgSpeed: number;
  distance: number;
  duration: number;
  elapsedTime: number;
  endLocation: EndLocation;
  maxCadence: number;
  maxHeartrate: number;
  startLocation: StartLocation;
  startTime: string | Date;
}

export interface BoundingBox {
  lat: number;
  lon: number;
}

export interface DisplayPath {
  lat: number;
  lon: number;
}

export interface Service {
  autoshare: {
    target: boolean;
    targettypes: any[];
    source: boolean;
  };
  import: boolean;
  name: string;
}

export interface Services {
  autoshare: {
    days: number;
    noprompt: boolean;
  };
  services: Service[];
}

export interface FMetadata {
  appversion: string;
  avgCadence: number;
  avgHeartrate: number;
  avgSpeed: number;
  calories: number;
  description: string;
  distance: number;
  duration: number;
  elapsedTime: number;
  elevationGain: number;
  elevationLoss: number;
  exports: any[];
  lapLength: number;
  maxCadence: number;
  maxElevation: number;
  maxHeartrate: number;
  maxSpeed: number;
  minElevation: number;
  source: string;
  sourceId: string;
  steps: number;
  swag: string;
  title: string;
  activityType: ActivityType;
  boundingBox: BoundingBox[];
  displayPath: DisplayPath[];
  laps: Lap[];
  services: Services;
  startTime: StartTime;
}
