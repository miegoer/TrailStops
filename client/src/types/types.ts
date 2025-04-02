export interface MarkerType {
  _id: string;
  hotel: string;
  prevIndex: number;
  nextIndex: number;
  prevDist?: {
    dist: number;
    time: number;
  };
  nextDist?: {
    dist: number;
    time: number;
  };
  position: L.LatLng;
};

export interface SettingsType {
  speed: number;
  distance: string;
}

export interface RoutePoint {
  lat: number;
  lng: number;
}