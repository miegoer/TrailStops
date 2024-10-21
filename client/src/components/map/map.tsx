import React from 'react';
import './map.css';
import { useEffect, useState } from 'react';
import { Marker, MapContainer, TileLayer, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import GPXLayer from '../gpxMapLayer/gpxMapLayer';
import closestPoints from '../../helperFunctions/closestPoint';
import routeCalculation from '../../helperFunctions/routeCalculation';
import DBService from '../../services/DBService';
import { v4 as uuidv4 } from 'uuid';
import 'leaflet-gpx';
import 'leaflet/dist/leaflet.css';
import { Button } from '@mui/material';
import DetailSummary from '../detailSummary/detailSummary';
import SearchResultScreen from '../searchResultScreen/searchResultScreen';
import Settings from '../settings/settings';
import TripDetailsScreen from '../tripDetailsScreen/tripDetailsScreen';
import { useUser } from '../../context/userContext';
import { MarkerType, RoutePoint } from '../../types/types';

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
  const [gpxRoute, setGpxRoute] = useState([]);
  const [selectedMarker, setSelectedMarker] = useState(null);
  const { settings, setSettings, settingsOverlay, setSettingsOverlay, tripDetailsOverlay, setTripDetailsOverlay, markers, setMarkers } = useUser();

  const setGpxRouteFunc = (route: L.Layer[]) => {
    setGpxRoute(route);
  }

  useEffect(() => {
    DBService.getMarkers("aidan@test.com").then((data) => {
      if (data) {
        const dataOut = data.reduce((acc: { [key: string]: MarkerType }, curr: MarkerType) => {
          acc[curr._id] = curr;
          return acc;
        }, {})
        setMarkers(dataOut);
        if (dataOut && Object.keys(dataOut).length > 0) {
          const firstMarker = dataOut[Object.keys(dataOut)[0]];
          if (firstMarker.walkingSpeed) {
            setSettings((prev: { distance: string; speed: number }) => ({
              ...prev,
              speed: firstMarker.walkingSpeed,
            }));
          }
        }
      }
    });
  }, []);
  

  // handler from marker being added to map
  const MapClickHandler: React.FC = () => {
    useMapEvents({
      click: async (e) => { 
        if (gpxRoute) {
          const closestPoint: RoutePoint = closestPoints(e.latlng); // snap clicked position to route
          const distanceToRoute = e.latlng.distanceTo(L.latLng(closestPoint.lat, closestPoint.lng));

          // Define a threshold for how close the click must be to the route (e.g., 1 kilometer)
          const thresholdDistance = 500; // Adjust this threshold as needed

          if (distanceToRoute <= thresholdDistance) {
          const newMarker = {
            _id: uuidv4(),
            user_id: 'aidan@test.com',
            position: L.latLng([closestPoint.lat, closestPoint.lng]),
            hotel: "",
            prevDist: { dist: 0, time: 0 },
            nextDist: { dist: 0, time: 0 },
            walkingSpeed: settings.speed,
            distanceMeasure: settings.distance
          };
          // update markers state and add maker to database
          let updatedMarkers = {...markers, [newMarker._id]:newMarker};
          const calculatedMarkers = await routeCalculation(Object.values(updatedMarkers), settings);
          setMarkers(calculatedMarkers);
          DBService.addMarker("aidan@test.com", calculatedMarkers[newMarker._id], calculatedMarkers, settings);
          // timeout to make sure point is added to state.
          setTimeout(() => {
            setSelectedMarker(calculatedMarkers[newMarker._id]);
          }, 100)
        }
        }
      },
    });
    return null;
  };

  return (
    <>
    <div className='mapContainer'>
    <MapContainer minZoom={9} style={{ height: '100vh', width: '100%' }} zoomControl={false} scrollWheelZoom={!selectedMarker} dragging={!selectedMarker} touchZoom={!selectedMarker}>
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <GPXLayer gpxFile={gpxFile} passRoute={setGpxRouteFunc}/>
      {Object.values(markers || {}).map((marker: MarkerType) => (
        <Marker key={marker._id} position={[marker.position.lat, marker.position.lng]} icon={defaultIcon} eventHandlers={{ click: () => setSelectedMarker(marker)}}/>
      ))}
      <MapClickHandler />
    </MapContainer>
    <img className='backpackMapImg' src='backpack.png' alt='brown backpack open at the front showing a wilderness scene inside'/>
    {(!selectedMarker && !tripDetailsOverlay && !settingsOverlay) && (
          <>
            <Button variant='contained' className='tripDetails' onClick={() => setTripDetailsOverlay(true)}>Trip Details</Button>
            <img className='settings' src='settings.webp' alt='line render of a settings cog icon' onClick={() => setSettingsOverlay(true)} />
            <DetailSummary markers={markers}/>
          </>
        )}
    </div>
    {selectedMarker && (
        <div className="overlay1" style={{ position: 'absolute', zIndex: 1000, top: 0, left: 0, width: '100%', height: '100%' }}>
        <SearchResultScreen marker={selectedMarker} setMarker={setSelectedMarker} />
        </div>
        )}
    {tripDetailsOverlay && (
        <div className="overlay2" style={{ position: 'absolute', zIndex: 1000, top: 0, left: 0, width: '100%', height: '100%' }}>
        <TripDetailsScreen setSelectedMarker={setSelectedMarker}/>
        </div>
        )}
    {settingsOverlay && (
      <div className="overlay3" style={{ position: 'absolute', zIndex: 1000, top: 0, left: 0, width: '100%', height: '100%' }}>
      <Settings />
      </div>
    )}
    </>
  );
};

export default MapComponent;
