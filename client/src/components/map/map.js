import './map.css';
import { MapContainer, TileLayer } from 'react-leaflet';
import RoutingMachine from '../leafletRoutingMachine/leafletRoutingMachine';

function Map() {

  //middle point of West Highland Way
  const position = [56.419955, -4.740438];
  const startPoint = [55.941410, -4.317811];
  const endPoint = [56.816415, -5.113943];

  return (
    <div className="map" data-testid="map-container">
      <MapContainer center={position} zoom={9} style={{ height: '100vh', width: '100%' }}>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <RoutingMachine start={startPoint} end={endPoint}/>
      </MapContainer>
    </div>
  );
}

export default Map;