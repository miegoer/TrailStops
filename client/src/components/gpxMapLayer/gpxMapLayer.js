import { useEffect } from 'react';
import { useMap, } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet-gpx';
import 'leaflet/dist/leaflet.css';
import './gpxMapLayer.css'


const GPXLayer = ({ gpxFile, passRoute}) => {
  const map = useMap();

  useEffect(() => {
    if (!map) return;

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
    };
  }, [map, gpxFile]);


  return null;
};


export default GPXLayer;