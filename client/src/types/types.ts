export interface MarkerType {
  _id: string;
  lat: number;
  lng: number;
  order: number;
  hotel: string;
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