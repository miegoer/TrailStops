import React from 'react';
import './tripDetailsScreen.css';
import { Button } from '@mui/material';
import { useUser } from '../../context/userContext';
import { MarkerType } from '../../types/types';
import { Marker } from 'leaflet';

type TripDetailsScreenProps = {
  setSelectedMarker: (marker: MarkerType) => void; // Assuming MarkerType is the type of your marker object
};

function TripDetailsScreen({ setSelectedMarker }: TripDetailsScreenProps) {

  const { markers, setTripDetailsOverlay } = useUser();

  const firstMarker: MarkerType | { prevDist: { dist: number; time: number } } = Object.values(markers).find((marker: MarkerType) => marker.order === 1) as MarkerType || {
    prevDist: { dist: 0, time: 0 }
  };

  const sortedMarkers = Object.values(markers).sort((a: MarkerType, b: MarkerType) => (a.order || 0) - (b.order || 0));

  return (
    <div className="tripDetailsScreen">
      <h1>Trip Details</h1>
      <ul className="tripDetailsList" style={{ justifyContent: 'flex-start' }}>
        <li>
          Start point
          <br />
          Distance to next stop: {firstMarker.prevDist?.dist ?? 0} km
          <br />
          Time to next stop: {firstMarker.prevDist?.time ?? 0} hrs
        </li>

        {sortedMarkers.map((marker: MarkerType) => (
          <li className='Item' key={marker._id}>
            Stop {marker.order ?? "Unknown"}: {marker.hotel || "No Accommodation Selected"}
            <br />
            Distance to next stop: {marker.nextDist?.dist ?? 0} km
            <br />
            Time to next stop: {marker.nextDist?.time ?? 0} hrs
            <br />
            <Button
              variant='contained'
              onClick={() => {
                setSelectedMarker(marker);
                setTripDetailsOverlay(false);
              }}
            >
              Edit
            </Button>
          </li>
        ))}

        <li>End Point</li>
      </ul>

      <Button variant='contained' className='backButton' onClick={() => setTripDetailsOverlay(false)}>Back</Button>
    </div>
  );
}

export default TripDetailsScreen;
