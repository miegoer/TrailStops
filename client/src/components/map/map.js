import { useState } from 'react';
import { MapContainer, TileLayer, useMapEvents, Marker } from 'react-leaflet';
import 'leaflet-gpx';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import GPXLayer from '../gpxMapLayer/gpxMapLayer';
import * as turf from '@turf/turf';
import routeData from '../../routeData';

const defaultIcon = L.icon({
  iconUrl: '/map-pin.svg',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

const MapComponent = () => {
  const gpxFile = '/WHW.gpx';
  const [markers, setMarkers] = useState([]);
  const [gpxRoute, setGpxRoute] = useState([]);


  const setGpxRouteFunc = (route) => {
    setGpxRoute(route);
  }

  const MapClickHandler = () => {
    useMapEvents({
      click(e) {
        const { lat, lng } = e.latlng;
        const point = turf.point([lat, lng]);
        console.log('point:', point);
        if (gpxRoute) {
          console.log('routeData:', routeData);
          const closestPoint = turf.nearestPointOnLine(routeData, point);
          console.log(closestPoint);
          console.log([closestPoint.geometry.coordinates[1], closestPoint.geometry.coordinates[0]]);
          setMarkers((prevMarkers) => [...prevMarkers, L.latLng([closestPoint.geometry.coordinates[1], closestPoint.geometry.coordinates[0]])]);
        }
      },
    });
    return null;
  };

  return (
    <MapContainer center={[51.505, -0.09]} zoom={13} style={{ height: '97vh', width: '100%' }} >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <GPXLayer gpxFile={gpxFile} passRoute={setGpxRouteFunc}/>
      {markers.map((marker, index) => (
        <Marker key={index} position={[marker.lat, marker.lng]} icon={defaultIcon} />
      ))}
      <MapClickHandler />
    </MapContainer>
  );
};

export default MapComponent;
