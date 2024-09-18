import { useEffect } from 'react';
import { useMap, } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet-gpx';
import 'leaflet/dist/leaflet.css';



const GPXLayer = ({ gpxFile }) => {
  const map = useMap();

  useEffect(() => {
    if (!map) return;

    const gpx = new L.GPX(gpxFile, {
      async: true,
    });

    gpx.addTo(map);

    gpx.on('loaded', (e) => {
      map.fitBounds(e.target.getBounds());
    });

    return () => {
      map.removeLayer(gpx);
    };
  }, [map, gpxFile]);

  return null;
};

export default GPXLayer;