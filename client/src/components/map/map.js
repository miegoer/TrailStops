import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, useMapEvents, Marker } from 'react-leaflet';
import 'leaflet-gpx';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import GPXLayer from '../gpxMapLayer/gpxMapLayer';
import closestPoints from './closestPoint';
import { useNavigate } from 'react-router-dom';
import DBService from '../../services/DBService';
import { v4 as uuidv4 } from 'uuid';

const defaultIcon = L.icon({
  iconUrl: '/map-pin.svg',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

const MapComponent = () => {
  const gpxFile = '/WHW.gpx';
  const [markers, setMarkers] = useState({});
  const [gpxRoute, setGpxRoute] = useState([]);
  const navigate = useNavigate();

  const setGpxRouteFunc = (route) => {
    setGpxRoute(route);
  }

  useEffect(() => {
    DBService.getMarkers("aidan@test.com").then((data) => {
      if (data) {
        setMarkers(data);
        }
      });
  }, []);

  const MapClickHandler = () => {
    useMapEvents({
      click(e) {
        const { lat, lng } = e.latlng;
        if (gpxRoute) {
          const closestPoint = closestPoints([lat, lng]);
          const newMarker = {
            _id: uuidv4(),
            user_id: 'aidan@test.com',
            position: L.latLng([closestPoint[0], closestPoint[1]]),
            hotel: ""
          };

          setMarkers((prevMarkers) => {
            const updatedMarkers = {...prevMarkers, [newMarker._id]:newMarker};
            DBService.addMarker("aidan@test.com", newMarker);
            return updatedMarkers;
          });
          setTimeout(() => {
            navigate('/search', {state: { marker:newMarker }});
          }, 100)
        }
      },
    });
    return null;
  };

  const MarkerClickHandler = (marker) => {
    navigate('/search', {state: { marker: marker }})
  }

  return (
    <MapContainer zoom={13} style={{ height: '100vh', width: '100%' }} zoomControl={false} >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <GPXLayer gpxFile={gpxFile} passRoute={setGpxRouteFunc}/>
      {Object.values(markers || {}).map((marker) => (
        <Marker key={marker._id} position={[marker.position.lng, marker.position.lat]} icon={defaultIcon} eventHandlers={{ click: () => MarkerClickHandler(marker)}}/>
      ))}
      <MapClickHandler />
    </MapContainer>
  );
};

export default MapComponent;
