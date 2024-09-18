import { useEffect } from "react";
import { useMap } from "react-leaflet";
import L from 'leaflet'
import 'leaflet-routing-machine';

const RoutingMachine = ({ start, end }) => {
  const map = useMap();

  useEffect(() => {
    if (!map) return;

    const routingControl = L.Routing.control({
      waypoints: [
        L.latLng(start[0], start[1]),
        L.latLng(end[0], end[1])
      ],
      lineOptions: {
        styles: [{ color: '#6FA1EC', weight: 4 }] 
      },
      show: false,
      addWaypoints: true, 
      routeWhileDragging: false, 
      draggableWaypoints: false,
    }).addTo(map);

    return () => {
      map.removeControl(routingControl);
    };
  }, [map, start, end]);

  return (
    <div data-testid="route-container">
  </div>
  ); 
};

export default RoutingMachine;
