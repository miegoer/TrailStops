
import './map.css';
import { useEffect, useState } from 'react';
import { Marker, MapContainer, TileLayer, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import GPXLayer from '../gpxMapLayer/gpxMapLayer';
import closestPoints from '../../helperFunctions/closestPoint';
import routeCalculation from '../../helperFunctions/routeCalculation';
import { useNavigate } from 'react-router-dom';
import DBService from '../../services/DBService';
import { v4 as uuidv4 } from 'uuid';
import 'leaflet-gpx';
import 'leaflet/dist/leaflet.css';
import { Button } from '@mui/material';

// set icon for placed markers
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

  // handler from marker being added to map
  const MapClickHandler = () => {
    useMapEvents({
      click: async (e) => { 
        const { lat, lng } = e.latlng;  // get position of click
        if (gpxRoute) {
          const closestPoint = closestPoints([lat, lng]); // snap clicked position to route
          const newMarker = {
            _id: uuidv4(),
            user_id: 'aidan@test.com',
            position: L.latLng([closestPoint[1], closestPoint[0]]),
            hotel: "",
            prevDist: { dist: 0, time: 0 },
            nextDist: { dist: 0, time: 0 },
          };
          // update markers state and add maker to database
          let updatedMarkers = {...markers, [newMarker._id]:newMarker};
          const calculatedMarkers = await routeCalculation(Object.values(updatedMarkers));
          setMarkers(calculatedMarkers);
          DBService.addMarker("aidan@test.com", calculatedMarkers[newMarker._id], calculatedMarkers);
          // timeout to make sure point is added to state.
          setTimeout(() => {
            navigate('/search', {state: { marker:calculatedMarkers[newMarker._id] }});
          }, 100)
        }
      },
    });
    return null;
  };

  // handler for placed marker being clicked
  const MarkerClickHandler = (marker) => {
    if (marker) {
      navigate('/search', { state: { marker: marker } });
    } else {
      console.error("Marker not found in state");
    }
  };

  // handler from tripDetails button being clicked
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
    <Button variant='contained' className='tripDetails' onClick={TripDetailsClickHandler}>Trip Details</Button>
    <img className='backpackMapImg' src='backpack.png' alt='brown backpack open at the front showing a wilderness scene inside'/>
    <img className='settings' src='settings.webp' alt='line render of a settings cog icon' onClick={() => navigate('/settings')}/>
    </>
  );
};

export default MapComponent;
