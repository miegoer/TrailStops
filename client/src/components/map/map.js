import { useState } from 'react';
import { MapContainer, TileLayer, useMapEvents, Marker } from 'react-leaflet';
import 'leaflet-gpx';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import GPXLayer from '../gpxMapLayer/gpxMapLayer';

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

  const MapClickHandler = () => {
    useMapEvents({
      click(e) {
        const { lat, lng } = e.latlng;
        setMarkers((prevMarkers) => [...prevMarkers, { lat, lng }]);
      },
    });
    return null;
  };

  return (
    <MapContainer center={[51.505, -0.09]} zoom={13} style={{ height: '97vh', width: '100%' }} >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <GPXLayer gpxFile={gpxFile} />
      {markers.map((marker, index) => (
        <Marker key={index} position={[marker.lat, marker.lng]} icon={defaultIcon} />
      ))}
      <MapClickHandler />
    </MapContainer>
  );
};

export default MapComponent;
