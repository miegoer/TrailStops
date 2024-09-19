import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, useMapEvents, Marker } from 'react-leaflet';
import 'leaflet-gpx';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import GPXLayer from '../gpxMapLayer/gpxMapLayer';
import closestPoints from './closestPoint';
import { useNavigate, useLocation } from 'react-router-dom';
import DBService from '../../services/DBService';

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
  const navigate = useNavigate();
  const location = useLocation();
  const { email } = location.state || {};

  const setGpxRouteFunc = (route) => {
    setGpxRoute(route);
  }

  useEffect(() => {
    DBService.getMarkers("aidan@test.com").then((data) => {
      if (data) {
        // for(let i=0; i<data.points.length; i++) {
        //   setMarkers((prevMarkers) => [...prevMarkers, L.latLng([data.points[i][1], data.points[i][0]])]);
        // }
        if (data.points.length > 0) {
          setMarkers(data.points);
      }
    }});
  }, []);

  const MapClickHandler = () => {
    useMapEvents({
      click(e) {
        const { lat, lng } = e.latlng;
        if (gpxRoute) {
          const closestPoint = closestPoints([lat, lng]);
          setMarkers((prevMarkers) => {
            const updatedMarkers = [...prevMarkers, L.latLng([closestPoint[1], closestPoint[0]])]
            console.log("markers", updatedMarkers)
            DBService.addMarker("aidan@test.com", updatedMarkers, []);
            return updatedMarkers;
          });
          setTimeout(() => {
            navigate('/search', {state: { closestPoint }});
          }, 100)
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
