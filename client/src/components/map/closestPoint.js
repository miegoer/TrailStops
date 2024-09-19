import routeData from "../../routeData";
//TODO Make the line more accurate on the longitude

// Function to calculate where the clicked point will land between the closest two points on the route
function projectOntoSegment(inputPoint, routePoint1, routePoint2) {
  // x is latitude, y is longitude
  const [inputPointX, inputPointY] = inputPoint;
  const [routePoint1X, routePoint1Y] = routePoint1;
  const [routePoint2X, routePoint2Y] = routePoint2;

  const lengthSquared = (routePoint2X - routePoint1X) ** 2 + (routePoint2Y - routePoint1Y) ** 2;

  // calculate how far along the route the input is
  let t = ((inputPointX - routePoint1X) * (routePoint2X - routePoint1X) + (inputPointY - routePoint1Y) * (routePoint2Y - routePoint1Y)) / lengthSquared;

  // Clamp t to the range [0, 1] to make it a percentage along the segment
  t = Math.max(0, Math.min(1, t));

  // Calculate the closest point for the input between the two points
  const outputPointX = routePoint1X + t * (routePoint2X - routePoint1X);
  const outputPointY = routePoint1Y + t * (routePoint2Y - routePoint1Y);

  return [outputPointX, outputPointY];
}

// Function to find the two closest points on the route to the clicked point
function closestPoints(pointCor) {
  const [targetLon, targetLat] = pointCor;

  // Sort the route by longitude
  let sortedRoute = routeData.coordinates.slice().sort((a, b) => a[1] - b[1]);

  let low = 0;
  let high = sortedRoute.length - 1;

  // Check for edge cases where the target is outside the route bounds
  if (targetLon <= sortedRoute[low][1]) {
    return sortedRoute[low];
  } else if (targetLon >= sortedRoute[high][1]) {
    return sortedRoute[high];
  }

  // Binary search to find the closest two points by longitude
  while (low <= high) {
    let mid = Math.floor((low + high) / 2);

    if (sortedRoute[mid][1] === targetLon) {
      // If an exact match by longitude is found, return the closest latitude point
      return sortedRoute[mid];
    } else if (sortedRoute[mid][1] < targetLon) {
      low = mid + 1;
    } else {
      high = mid - 1;
    }
  }

  // After binary search, low and high should be the indices of the closest two points by longitude
  const lowerPoint = sortedRoute[high];
  const higherPoint = sortedRoute[low];

  // find the point the click would be closest to on a line between the two closest points
  const closestLinePoint = projectOntoSegment([targetLat, targetLon], lowerPoint, higherPoint);

  // Calculate the distances from the target point to the closestLinePoint, lowerPoint, and higherPoint
  const distanceToLower = Math.hypot(lowerPoint[0] - targetLat, lowerPoint[1] - targetLon);
  const distanceToHigher = Math.hypot(higherPoint[0] - targetLat, higherPoint[1] - targetLon);
  const distanceToProjection = Math.hypot(closestLinePoint[0] - targetLat, closestLinePoint[1] - targetLon);

  // Return the closest point: either the closestLinePoint or one of the two points
  if (distanceToProjection < Math.min(distanceToLower, distanceToHigher)) {
    return closestLinePoint;
  } else {
    return distanceToLower < distanceToHigher ? lowerPoint : higherPoint;
  }
}

export default closestPoints;