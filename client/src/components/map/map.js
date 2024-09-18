import './map.css';
import { MapContainer, TileLayer } from 'react-leaflet';

function Map() {

  //middle point of West Highland Way
  const position = [56.419955, -4.740438]

  return (
    <div className="map">
      <MapContainer center={position} zoom={9} style={{ height: '100vh', width: '100%' }}>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
      </MapContainer>
    </div>
  );
}

export default Map;