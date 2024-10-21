import { RoutePoint } from "../types/types";

export default function binarySearch(sortedRoute: RoutePoint[], targetLon: number): { exact?: RoutePoint, low?: number, high?: number } {

  let points: { exact?: RoutePoint, low?: number, high?: number } = {};
  points.low = 0;
  points.high = sortedRoute.length - 1;

  // Check for edge cases where the target is outside the route bounds
  if (targetLon <= sortedRoute[points.low].lng) {
    points.exact = sortedRoute[points.low];
  } else if (targetLon >= sortedRoute[points.high].lng) {
    points.exact = sortedRoute[points.high];
  }

  // Binary search to find the closest two points by longitude
  while (points.low <= points.high) {
    let mid = Math.floor((points.low + points.high) / 2);

    if (sortedRoute[mid].lng === targetLon) {
      // If an exact match by longitude is found, return the closest latitude point
      points.exact = sortedRoute[mid];
    } else if (sortedRoute[mid].lng < targetLon) {
      points.low = mid + 1;
    } else {
      points.high = mid - 1;
    }
  }

  return points;
}