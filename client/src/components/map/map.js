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
import routeCalculation from './routeCalculation';
import './map.css';


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
        const dataOut = data.reduce((acc, curr) => {
          acc[curr._id] = curr;
          return acc;
        }, {})
        setMarkers(dataOut);
        }
      });
  }, []);

  const MapClickHandler = () => {
    useMapEvents({
      click: async (e) => { 
        const { lat, lng } = e.latlng;
        if (gpxRoute) {
          const closestPoint = closestPoints([lat, lng]);
          const newMarker = {
            _id: uuidv4(),
            user_id: 'aidan@test.com',
            position: L.latLng([closestPoint[1], closestPoint[0]]),
            hotel: "",
            prevDist: { dist: 0, time: 0 },
            nextDist: { dist: 0, time: 0 },
          };

          let updatedMarkers = {...markers, [newMarker._id]:newMarker};

          setMarkers(updatedMarkers);

          const calculatedMarkers = await routeCalculation(Object.values(updatedMarkers));
          setMarkers(calculatedMarkers);
          DBService.addMarker("aidan@test.com", calculatedMarkers[newMarker._id], calculatedMarkers);
          setTimeout(() => {
            navigate('/search', {state: { marker:calculatedMarkers[newMarker._id] }});
          }, 100)
        }
      },
    });
    return null;
  };

  const MarkerClickHandler = (marker) => {
    if (marker) {
      console.log("Marker clicked:", marker);
      navigate('/search', { state: { marker: marker } });
    } else {
      console.error("Marker not found in state");
    }
  };

  const TripDetailsClickHandler = () => {
    navigate('/details', { state: { markers: markers} })
  }

  return (
    <>
    <MapContainer minZoom={9} style={{ height: '100vh', width: '100%' }} zoomControl={false} >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <GPXLayer gpxFile={gpxFile} passRoute={setGpxRouteFunc}/>
      {Object.values(markers || {}).map((marker) => (
        <Marker key={marker._id} position={[marker.position.lat, marker.position.lng]} icon={defaultIcon} eventHandlers={{ click: () => MarkerClickHandler(marker)}}/>
      ))}
      <MapClickHandler />
    </MapContainer>
    <button className='tripDetails' onClick={TripDetailsClickHandler}>Trip Details</button>
    <img className='backpack' src='backpack.png' alt='backpack'/>
    <img className='settings' src='settings.webp' alt='settings'/>
    </>
  );
};

export default MapComponent;
