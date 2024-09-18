import { MapContainer, TileLayer } from 'react-leaflet';
import 'leaflet-gpx'; // Import leaflet-gpx library
import 'leaflet/dist/leaflet.css';
import GPXLayer from './gpxMapLayer/gpxMapLayer';


const MapComponent = () => {
  const gpxFile = '/WHW.gpx';

  return (
    <MapContainer center={[51.505, -0.09]} zoom={13} style={{ height: '100vh', width: '100%' }}>
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      <GPXLayer gpxFile={gpxFile} />
    </MapContainer>
  );
};

export default MapComponent;
