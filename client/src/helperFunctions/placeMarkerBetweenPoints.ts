import { RoutePoint } from "../types/types";
// Function to calculate where the clicked point will land between the closest two points on the route
export default function placeMarkerBetweenPoints(inputPoint: RoutePoint, routePoint1: RoutePoint, routePoint2: RoutePoint) {

  const lengthSquared = (routePoint2.lat - routePoint1.lat) ** 2 + (routePoint2.lng - routePoint1.lng) ** 2;

  // calculate how far along the route the input is
  const relativePosition = ((inputPoint.lat - routePoint1.lat) * (routePoint2.lat - routePoint1.lat) + (inputPoint.lng - routePoint1.lng) * (routePoint2.lng - routePoint1.lng)) / lengthSquared;

  // Clamp the relative position to the range [0, 1] to make it a percentage along the segment
  const clampedRelativePosition = Math.max(0, Math.min(1, relativePosition));

  // Calculate the closest point for the input between the two points
  const outputPoint: RoutePoint = {
  lat: routePoint1.lat + clampedRelativePosition * (routePoint2.lat - routePoint1.lat),
  lng: routePoint1.lng + clampedRelativePosition * (routePoint2.lng - routePoint1.lng)
  }
  return outputPoint;
}