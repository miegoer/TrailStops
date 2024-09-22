import './tripDetailsScreen.css';
import { useLocation, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

function TripDetailsScreen() {
  const location = useLocation();
  const navigate = useNavigate();
  const { markers } = location.state || {};
  
  useEffect(() => {
    console.log(markers);
  })

  const firstMarker = Object.values(markers).find(marker => marker.order === 1) || {};

  const sortedMarkers = Object.values(markers).sort((a, b) => a.order - b.order);
 
  return (
    <div className="tripDetailsScreen">
      <h1>Trip Details</h1>
      <ul>
        <li>Start point
          <br />
          distance to next stop: {firstMarker.prevDist?.dist}
          <br />
          time to next stop: {firstMarker.prevDist?.time}
        </li>

        {sortedMarkers.map((marker) => (
          <li key={marker._id}>
            stop {marker.order}: {marker.hotel === "" ? "No Accomodation Selected" : marker.hotel}
            <br />
            distance to next stop: {marker.nextDist?.dist}
            <br />
            time to next stop: {marker.nextDist?.time}
            <br />
            <button onClick={() => navigate('/search', { state: { marker } })}>Edit</button>
          </li>
        ))}
      </ul>
      <button onClick={() => navigate('/map')}>Back</button>
    </div>
  );
}

export default TripDetailsScreen;