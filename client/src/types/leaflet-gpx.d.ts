import { LatLngBounds, Layer } from 'leaflet';

declare module 'leaflet' {
  class GPX extends Layer {
    constructor(gpx: string, options?: any);
    getLayers(): Layer[];
    getBounds(): LatLngBounds;
  }
}