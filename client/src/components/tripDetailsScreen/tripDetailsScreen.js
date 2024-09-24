import './tripDetailsScreen.css';
import { useEffect } from 'react';
import { Button } from '@mui/material';

function TripDetailsScreen({ closeOverlay, markers, setSelectedMarker }) {
  
  useEffect(() => {
  })

  const firstMarker = Object.values(markers).find(marker => marker.order === 1) || {};

  const sortedMarkers = Object.values(markers).sort((a, b) => a.order - b.order);
 
  return (
    <div className="tripDetailsScreen">
      <h1>Trip Details</h1>
      <ul className="tripDetailsList" style={{ justifyContent: 'flex-start' }}>
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
            <Button variant='contained' onClick={() => {
              setSelectedMarker(marker);
              closeOverlay();
        }}>Edit</Button>
          </li>
        ))}
        <li>End Point</li>
      </ul>
      <Button variant='contained' className='backButton' onClick={() => closeOverlay()}>Back</Button>
    </div>
  );
}

export default TripDetailsScreen;