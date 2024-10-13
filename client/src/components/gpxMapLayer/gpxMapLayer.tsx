import { useEffect } from 'react';
import { useMap, } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet-gpx';
import 'leaflet/dist/leaflet.css';
import './gpxMapLayer.css'

interface GPXLayerProps {
  gpxFile: string; // Assuming the GPX file is passed as a string (e.g., URL or file path)
  passRoute: (route: L.Layer[]) => void; // passRoute function accepts an array of Leaflet Layers
}

// function to generate the route line on the map
const GPXLayer: React.FC<GPXLayerProps> = ({ gpxFile, passRoute }) => {
  const map = useMap();

  useEffect(() => {
    if (!map) return;
    // line settings for rendering
    const gpx = new L.GPX(gpxFile, {
      async: true,
      polyline_options: {
        weight: 8,
        color: '#c64242'
      }
    });

    gpx.addTo(map);
    gpx.on('loaded', () => {
      const route = gpx.getLayers();
      passRoute(route);
      map.fitBounds(gpx.getBounds());

    });

    return () => {
      map.removeLayer(gpx);
      map.attributionControl.setPrefix(''); // removes 'leaflet' corner link
    };
  }, []);

  return null;
};

export default GPXLayer;