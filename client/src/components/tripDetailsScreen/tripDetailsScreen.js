import './tripDetailsScreen.css';
import { useLocation, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { Button } from '@mui/material';

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
      <ul className="tripDetailsList">
        <li>Start point
          <br />
          Distance to next stop: {firstMarker.prevDist?.dist} km
          <br />
          Time to next stop: {firstMarker.prevDist?.time} hrs
        </li>

        {sortedMarkers.map((marker) => (
          <li key={marker._id}>
            Stop {marker.order}: {marker.hotel === "" ? "No Accomodation Selected" : marker.hotel}
            <br />
            Distance to next stop: {marker.nextDist?.dist} km
            <br />
            Time to next stop: {marker.nextDist?.time} hrs
            <br />
            <Button variant='contained' onClick={() => navigate('/search', { state: { marker } })}>Edit</Button>
          </li>
        ))}
      </ul>
      <Button variant='contained' className='backButton' onClick={() => navigate('/map')}>Back</Button>
    </div>
  );
}

export default TripDetailsScreen;