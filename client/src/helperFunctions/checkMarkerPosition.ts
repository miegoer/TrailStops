import { MarkerType } from "../types/types";

// check that the current marker falls between its surrounding route points
// lats & lngs either in a positive or negative direction
export default function isMarkerBetweenRoutePoints (marker: MarkerType, routePoint1: { lng: number; lat: number; }, routePoint2: { lng: number; lat: number; }) {
  return (
    ((marker.position.lng >= routePoint1.lng && marker.position.lng <= routePoint2.lng) ||
     (marker.position.lng <= routePoint1.lng && marker.position.lng >= routePoint2.lng)) &&
    ((marker.position.lat >= routePoint1.lat && marker.position.lat <= routePoint2.lat) ||
     (marker.position.lat <= routePoint1.lat && marker.position.lat >= routePoint2.lat))
  );
};
