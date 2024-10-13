import './searchResultScreen.css';
import APIService from '../../services/googleAPIService';
import { useState, useEffect } from 'react';
import DBService from '../../services/DBService';
import { Button } from '@mui/material';
import routeCalculation from '../../helperFunctions/routeCalculation';
import { useUser } from '../../context/userContext';

function SearchResultScreen({ marker, setMarker }) {
  const { markers, setMarkers, settings } = useUser();
  const [nearAccommodation, setNearAccommodation] = useState([]);
  const [selectedAccommodation, setSelectedAccommodation] = useState("")


  useEffect(() => {
    if (marker.position) {
      const [lon, lat] = [marker.position.lat, marker.position.lng];
      APIService.extractAccommodations(lon, lat)
        .then((data) => {
          setNearAccommodation(Array.isArray(data) ? data : []);
        })
      }
       if (marker._id) {
        DBService.getAccommodation("aidan@test.com", marker._id)
        .then((hotel) => {
          if (hotel) {
            setSelectedAccommodation(hotel.hotel);
        } else {
          console.error("Markers data is not in the expected format", hotel);
        }
        })
      }
  }, []);

  function updateAccommodation (accommodation) {
    setSelectedAccommodation(accommodation)
    const updatedMarkers = { ...markers, [marker._id]:{...marker, hotel:accommodation}};
    setMarkers(updatedMarkers);
    DBService.addAccommodation("aidan@test.com", accommodation, marker._id)
  }

  async function deleteMarker (markerId) {
    DBService.removeMarker("aidan@test.com", markerId);
    const updatedMarkers = { ...markers };
    delete updatedMarkers[markerId];
    const calculatedMarkers = await routeCalculation(Object.values(updatedMarkers), settings)
    .then((calculatedMarkers) => {
      setMarkers(calculatedMarkers);
      setMarker(null);
    });
  };

  return (
    <div className='searchResultScreen'>
      {marker.position ? (
        <div className='accommodationOptions'>
        <ul className='accommodationList'>
          {nearAccommodation && nearAccommodation.length > 0 ? (
            nearAccommodation.map((accommodation, index) => (
              <div key={index}>
              <li key={index}>{accommodation.name}
                <br />
                {accommodation.vicinity}
              </li>
              <img className='accommodationImage' src={accommodation.url.data} alt={accommodation.name} />
              <Button variant='contained' onClick={() => updateAccommodation(accommodation.name + " - " + accommodation.vicinity)}>Select</Button>
              </div>
            ))
              
          ) : (
            <p>No accommodation found.</p>
          )}
        </ul>
        <p className='wildOption'>Wild Camping</p>
        <Button variant='contained' onClick={() => updateAccommodation("Wild Camping")}>Select</Button>
        </div>
      ) : (
        <p>No closest point data available.</p>
      )}
        <div>
        <h1>stop {marker.order}</h1>
        <h2>Previous Stop: {marker.prevDist?.dist ? `${marker.prevDist.dist} km` : 'N/A'}</h2>
        <h3>Time from previous stop: {marker.prevDist?.time ? `${marker.prevDist.time} hours` : 'N/A'}</h3>
        <h2>Next Stop: {marker.nextDist?.dist ? `${marker.nextDist.dist} km` : 'N/A'}</h2>
        <h3>Time to next stop: {marker.nextDist?.time ? `${marker.nextDist.time} hours` : 'N/A'}</h3>
        <p>Selected accommodation: 
        {selectedAccommodation === "" ? " no accommodation selected" : ` ${selectedAccommodation}`}
      </p>
      <Button variant='contained' style={{marginRight: "10px"}} onClick={() => setMarker(null)}>Back</Button>
      <Button variant='contained' onClick={() => deleteMarker(marker._id)}>Delete Marker</Button>
      </div>
    </div>
  )
}

export default SearchResultScreen;