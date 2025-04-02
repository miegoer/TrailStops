import createGPXArray from "./createGPXArray";
import haversineDistanceCalc from "./haversineDistanceCalc";
import isMarkerBetweenRoutePoints from "./checkMarkerPosition";
import { MarkerType } from "../types/types";

// loop through all points in route from index1 to index2 to calculate an accurate distance.
function fullDistanceCalc(markerDist: number, routeArr: {lat: number; lng: number; }[], routeIndex1: number, routeIndex2: number, distance: string) {
  for (let i = routeIndex1; i < routeIndex2; i++) {
    markerDist = markerDist + haversineDistanceCalc(routeArr[i], routeArr[i+1], distance);
  }
  return Math.round(markerDist);
}

function walkingTimeCalc(markerDist: number, speed: number) {
  return Math.round(markerDist / speed);
}

async function routeCalculation (markerArr: MarkerType[], calculationSettings: {speed: number; distance: string;}) {
  const routeArr = await createGPXArray("WHW.gpx");
  let markerArrCopy = JSON.parse(JSON.stringify(markerArr));
  // find where the markers fall between in the route
  for (let i = 0; i < markerArrCopy.length; i++) {  // loop through markerArr
    if (!markerArrCopy[i].prevIndex && !markerArrCopy[i].nextIndex) {
      for (let j = 0; j < routeArr.length - 1; j++) { // loop through routeArr
        if (isMarkerBetweenRoutePoints(markerArrCopy[i], routeArr[j], routeArr[j + 1])) { 
          markerArrCopy[i].prevIndex = j
          markerArrCopy[i].nextIndex = j+1
        }
      }
    }
  }
  // TODO implement both ways search

  // sort markerArrCopy to to be in order of prevIndex
  markerArrCopy.sort((a: { prevIndex: number; }, b: { prevIndex: number; }) => a.prevIndex - b.prevIndex);
  
  // calculate prev and next distance for each marker to their prev and next route point
  for (let i = 0; i < markerArrCopy.length; i++) {
    markerArrCopy[i].prevDist.dist = haversineDistanceCalc(routeArr[markerArrCopy[i].prevIndex], markerArrCopy[i].position, calculationSettings.distance);
    markerArrCopy[i].nextDist.dist = haversineDistanceCalc(routeArr[markerArrCopy[i].nextIndex], markerArrCopy[i].position, calculationSettings.distance);
  }

  // calculate full distances between markers
  for (let i = 0; i < markerArrCopy.length; i++) {
    if (markerArrCopy.length === 1) {
      markerArrCopy[i].prevDist.dist = fullDistanceCalc(markerArrCopy[i].prevDist.dist, routeArr, 0, markerArrCopy[i].prevIndex, calculationSettings.distance);
      markerArrCopy[i].nextDist.dist = fullDistanceCalc(markerArrCopy[i].nextDist.dist, routeArr, markerArrCopy[i].nextIndex, routeArr.length-1, calculationSettings.distance);
    } else if (i === 0) {
      markerArrCopy[i].prevDist.dist = fullDistanceCalc(markerArrCopy[i].prevDist.dist, routeArr, 0, markerArrCopy[i].prevIndex, calculationSettings.distance);
      markerArrCopy[i].nextDist.dist = fullDistanceCalc(markerArrCopy[i].nextDist.dist, routeArr, markerArrCopy[i].nextIndex, markerArrCopy[i+1].prevIndex, calculationSettings.distance);
    } else if (i === markerArrCopy.length - 1) {
      markerArrCopy[i].prevDist.dist = fullDistanceCalc(markerArrCopy[i].prevDist.dist, routeArr, markerArrCopy[i-1].nextIndex, markerArrCopy[i].prevIndex, calculationSettings.distance);
      markerArrCopy[i].nextDist.dist = fullDistanceCalc(markerArrCopy[i].nextDist.dist, routeArr, markerArrCopy[i].nextIndex, routeArr.length-1, calculationSettings.distance);
    } else {
      markerArrCopy[i].prevDist.dist = fullDistanceCalc(markerArrCopy[i].prevDist.dist, routeArr, markerArrCopy[i-1].nextIndex, markerArrCopy[i].prevIndex, calculationSettings.distance);
      markerArrCopy[i].nextDist.dist = fullDistanceCalc(markerArrCopy[i].nextDist.dist, routeArr, markerArrCopy[i].nextIndex, markerArrCopy[i+1].prevIndex, calculationSettings.distance);
    }
  }

  // delete prevIndex and nextIndex as no longer needed
  for (let i = 0; i < markerArrCopy.length; i++) {
    delete markerArrCopy[i].prevIndex;
    delete markerArrCopy[i].nextIndex;
  }

  //calculate previous and next walking time
  for (let i = 0; i < markerArrCopy.length; i++) {
    markerArrCopy[i].prevDist.time = walkingTimeCalc(markerArrCopy[i].prevDist.dist, calculationSettings.speed);
    markerArrCopy[i].nextDist.time = walkingTimeCalc(markerArrCopy[i].nextDist.dist, calculationSettings.speed);
  }

  //save marker route order in marker
  for (let i = 0; i < markerArrCopy.length; i++) {
    markerArrCopy[i].order = i +1;
  }

  return markerArrCopy;
}

export default routeCalculation;