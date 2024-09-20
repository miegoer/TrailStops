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

  const setGpxRouteFunc = (route) => {
    setGpxRoute(route);
  }

  useEffect(() => {
    DBService.getMarkers("aidan@test.com").then((data) => {
      if (data) {
        if (data.length > 0) {
          setMarkers(data);
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
            DBService.addMarker("aidan@test.com", updatedMarkers);
            return updatedMarkers;
          });
          setTimeout(() => {
            navigate('/search', {state: { closestPoint, index: markers.length }});
          }, 100)
        }
      },
    });
    return null;
  };

  const MarkerClickHandler = (index, closestPoint) => {
    closestPoint = closestPoints([closestPoint.lat, closestPoint.lng])
    navigate('/search', {state: { index: index, closestPoint: closestPoint }})
  }

  return (
    <MapContainer zoom={13} style={{ height: '100vh', width: '100%' }} zoomControl={false} >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <GPXLayer gpxFile={gpxFile} passRoute={setGpxRouteFunc}/>
      {markers.map((marker, index) => (
        <Marker key={index} position={[marker.lat, marker.lng]} icon={defaultIcon} eventHandlers={{ click: () => MarkerClickHandler(index, marker)}}/>
      ))}
      <MapClickHandler />
    </MapContainer>
  );
};

export default MapComponent;
