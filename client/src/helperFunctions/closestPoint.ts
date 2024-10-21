import binarySearch from "./binarySearch";
import routeData from "../routeData";
import placeMarkerBetweenPoints from "./placeMarkerBetweenPoints";
import { RoutePoint } from "../types/types";
import { point } from "leaflet";
//TODO Make the line more accurate on the longitude

// Function to find the two closest points on the route to the clicked point
function closestPoints(pointCoords: RoutePoint) {
  
  const route: RoutePoint[] = routeData.coordinates.map((a) => ({ lat: a[1], lng: a[0] }));
  // Sort the route by longitude
  let sortedRoute: RoutePoint[] = route.sort((a, b) => a.lng - b.lng);

  const points = binarySearch(sortedRoute, pointCoords.lng);

  if (points.exact) return points.exact;
  // After binary search, low and high should be the indices of the closest two points by longitude
  const lowerPoint: RoutePoint = sortedRoute[points.high];
  const higherPoint: RoutePoint = sortedRoute[points.low];

  // find the point the click would be closest to on a line between the two closest points
  const closestLinePoint: RoutePoint = placeMarkerBetweenPoints(pointCoords, lowerPoint, higherPoint);

  // Calculate the distances from the target point to the closestLinePoint, lowerPoint, and higherPoint
  const distanceToLower = Math.hypot(lowerPoint.lat - pointCoords.lat, lowerPoint.lng - pointCoords.lng);
  const distanceToHigher = Math.hypot(higherPoint.lat - pointCoords.lat, higherPoint.lng - pointCoords.lng);
  const distanceToProjection = Math.hypot(closestLinePoint.lat - pointCoords.lat, closestLinePoint.lng - pointCoords.lng);

  // Return the closest point: either the closestLinePoint or one of the two points
  if (distanceToProjection < Math.min(distanceToLower, distanceToHigher)) {
    return closestLinePoint;
  } else {
    return distanceToLower < distanceToHigher ? lowerPoint : higherPoint;
  }
}

export default closestPoints;