// load GPX track as an array of points
async function loadGPXTrackPoints(url) {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`error fetching route status: ${response.status}`);
    }

    const gpxText = await response.text();
    const parser = new DOMParser();
    const gpxDoc = parser.parseFromString(gpxText, "application/xml");

    const trackPoints = gpxDoc.getElementsByTagName("trkpt");
    const latLngArray = [];

    for (let i = 0; i < trackPoints.length; i++) {
      const lat = trackPoints[i].getAttribute("lat");
      const lon = trackPoints[i].getAttribute("lon");

      latLngArray.push({ lat: parseFloat(lat), lng: parseFloat(lon) });
    }

    return latLngArray;
  } catch (error) {
    console.error("Error loading GPX:", error);
  }
}

// Haversine formula to calculate distance between two coordinates on earth
function haversineDistance(coord1, coord2) {
  const R = 6371e3; // Radius of Earth in meters
  const lat1 = coord1.lat * Math.PI / 180;
  const lat2 = coord2.lat * Math.PI / 180;
  const deltaLat = (coord2.lat - coord1.lat) * Math.PI / 180;
  const deltaLng = (coord2.lng - coord1.lng) * Math.PI / 180;

  const a = Math.sin(deltaLat / 2) * Math.sin(deltaLat / 2) +
  Math.cos(lat1) * Math.cos(lat2) *
  Math.sin(deltaLng / 2) * Math.sin(deltaLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  const distInMeters = R * c;
  return distInMeters / 1000; //kilometer conversion
}

// loop through all points in route from index1 to index2 to calculate an accurate distance.
function fullDistanceCalc(markerDist, routeArr, routeIndex1, routeIndex2) {
  for (let i = routeIndex1; i < routeIndex2; i++) {
    markerDist = markerDist + haversineDistance(routeArr[i], routeArr[i+1]);
  }
  return Math.round(markerDist);
}

function walkingTimeCalc(markerDist) {
  return Math.round(markerDist / 2);
}

async function routeCalculation (markerArr) {
  const routeArr = await loadGPXTrackPoints("WHW.gpx");
  let markerArrCopy = JSON.parse(JSON.stringify(markerArr));
  // find where the markers fall between in the route
  for (let i = 0; i < markerArrCopy.length; i++) {  // loop through markerArr
    let high = routeArr.length - 2; // start search at opposite end aswell TODO implement both ways search
    for (let j = 0; j < routeArr.length - 1; j++) { // loop through routeArr
      if (((markerArrCopy[i].position.lng >= routeArr[j].lng && markerArr[i].position.lng <= routeArr[j+1].lng)||     // check that the current marker falls
           (markerArrCopy[i].position.lng <= routeArr[j].lng && markerArr[i].position.lng >= routeArr[j+1].lng)) &&   // between its surrounding route points
           ((markerArrCopy[i].position.lat >= routeArr[j].lat && markerArr[i].position.lat <= routeArr[j+1].lat)||    // lats & lngs either in a positive
           (markerArrCopy[i].position.lat <= routeArr[j].lat && markerArr[i].position.lat >= routeArr[j+1].lat))) {   // or negative direction
        markerArrCopy[i].prevIndex = j
        markerArrCopy[i].nextIndex = j+1
      }
    }
  }

  // sort markerArrCopy to to be in order of prevIndex
  markerArrCopy.sort((a, b) => a.prevIndex - b.prevIndex);
  
  // calculate prev and next distance for each marker to their prev and next route point
  for (let i = 0; i < markerArrCopy.length; i++) {
    markerArrCopy[i].prevDist.dist = haversineDistance(routeArr[markerArrCopy[i].prevIndex], markerArrCopy[i].position);
    markerArrCopy[i].nextDist.dist = haversineDistance(routeArr[markerArrCopy[i].nextIndex], markerArrCopy[i].position);
  }

  // calculate full distances between markers
  for (let i = 0; i < markerArrCopy.length; i++) {
    console.log("Marker position:", markerArrCopy[i].position);
    if (markerArrCopy.length === 1) {
      markerArrCopy[i].prevDist.dist = fullDistanceCalc(markerArrCopy[i].prevDist.dist, routeArr, 0, markerArrCopy[i].prevIndex);
      markerArrCopy[i].nextDist.dist = fullDistanceCalc(markerArrCopy[i].nextDist.dist, routeArr, markerArrCopy[i].nextIndex, routeArr.length-1);
    } else if (i === 0) {
      markerArrCopy[i].prevDist.dist = fullDistanceCalc(markerArrCopy[i].prevDist.dist, routeArr, 0, markerArrCopy[i].prevIndex);
      markerArrCopy[i].nextDist.dist = fullDistanceCalc(markerArrCopy[i].nextDist.dist, routeArr, markerArrCopy[i].nextIndex, markerArrCopy[i+1].prevIndex);
    } else if (i === markerArrCopy.length - 1) {
      markerArrCopy[i].prevDist.dist = fullDistanceCalc(markerArrCopy[i].prevDist.dist, routeArr, markerArrCopy[i-1].nextIndex, markerArrCopy[i].prevIndex);
      markerArrCopy[i].nextDist.dist = fullDistanceCalc(markerArrCopy[i].nextDist.dist, routeArr, markerArrCopy[i].nextIndex, routeArr.length-1);
    } else {
      markerArrCopy[i].prevDist.dist = fullDistanceCalc(markerArrCopy[i].prevDist.dist, routeArr, markerArrCopy[i-1].nextIndex, markerArrCopy[i].prevIndex);
      markerArrCopy[i].nextDist.dist = fullDistanceCalc(markerArrCopy[i].nextDist.dist, routeArr, markerArrCopy[i].nextIndex, markerArrCopy[i+1].prevIndex);
    }
  }

  // delete prevIndex and nextIndex as no longer needed
  for (let i = 0; i < markerArrCopy.length; i++) {
    delete markerArrCopy[i].prevIndex;
    delete markerArrCopy[i].nextIndex;
  }

  //calculate previous and next walking time
  for (let i = 0; i < markerArrCopy.length; i++) {
    markerArrCopy[i].prevDist.time = walkingTimeCalc(markerArrCopy[i].prevDist.dist);
    markerArrCopy[i].nextDist.time = walkingTimeCalc(markerArrCopy[i].nextDist.dist);
  }

  //save marker route order in marker
  for (let i = 0; i < markerArrCopy.length; i++) {
    markerArrCopy[i].order = i +1;
  }

  // change markers back to object
  const output = markerArrCopy.reduce((acc, curr) => {
    acc[curr._id] = curr;
    return acc;
  }, {});

  return output;
}

export default routeCalculation;