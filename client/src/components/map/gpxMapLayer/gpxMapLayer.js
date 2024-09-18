import { useEffect } from 'react';
import { useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet-gpx'; // Import leaflet-gpx library
import 'leaflet/dist/leaflet.css';


const GPXLayer = ({ gpxFile }) => {
  const map = useMap();

  useEffect(() => {
    if (!map) return;

    const gpx = new L.GPX(gpxFile, {
      async: true,
      marker_options: {
        startIconUrl: 'https://leafletjs.com/examples/custom-icons/leaf-green.png',
        endIconUrl: 'https://leafletjs.com/examples/custom-icons/leaf-red.png',
        shadowUrl: 'https://leafletjs.com/examples/custom-icons/leaf-shadow.png',
      }
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