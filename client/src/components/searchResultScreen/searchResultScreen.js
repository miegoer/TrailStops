import './searchResultScreen.css';
import { useLocation, useNavigate } from 'react-router-dom';
import { extractAccomodations } from '../../services/googleAPIService';
import { useState, useEffect } from 'react';
import DBService from '../../services/DBService';

function SearchResultScreen() {
  const location = useLocation();
  const navigate = useNavigate();
  const { marker } = location.state || {};
  const [nearAccommodation, setNearAccommodation] = useState([]);
  const [selectedAccommodation, setSelectedAccommodation] = useState("")


  useEffect(() => {
    if (marker.position) {
      const [lon, lat] = [marker.position.lat, marker.position.lng];
      extractAccomodations(lon, lat)
        .then((data) => {
          setNearAccommodation(Array.isArray(data) ? data : []);
        })
      }
       if (marker._id) {
        DBService.getAccommodation("aidan@test.com", marker._id) //WORK FROM HERE ADD THE MarkerId
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
    DBService.addAccommodation("aidan@test.com", accommodation, marker._id)
  }

  const deleteMarker = (markerId) => {
    DBService.removeMarker("aidan@test.com", markerId);
    navigate('/map')
  };

  return (
    <div className='searchResultScreen'>
        <h1>stop {marker.order}</h1>
        <h2>Previous Stop: {marker.prevDist?.dist ? `${marker.prevDist.dist} km` : 'N/A'}</h2>
        <h3>Time from previous stop: {marker.prevDist?.time ? `${marker.prevDist.time} hours` : 'N/A'}</h3>
        <h2>Next Stop: {marker.nextDist?.dist ? `${marker.nextDist.dist} km` : 'N/A'}</h2>
        <h3>Time to next stop: {marker.nextDist?.time ? `${marker.nextDist.time} hours` : 'N/A'}</h3>
      {marker.position ? (
        <div>
        <ul>
          {nearAccommodation && nearAccommodation.length > 0 ? (
            nearAccommodation.map((accommodation, index) => (
              <div key={index}>
              <li key={index}>{accommodation}</li>
              <button onClick={() => updateAccommodation(accommodation)}>Select</button>
              </div>
            ))
              
          ) : (
            <p>No accommodation found.</p>
          )}
        </ul>
        <p className='wildOption'>Wild Camping</p>
        <button onClick={() => updateAccommodation("Wild Camping")}>Select</button>
        </div>
      ) : (
        <p>No closest point data available.</p>
      )}
      <p>Selected accommodation: 
        {selectedAccommodation === "" ? " no accommodation selected" : ` ${selectedAccommodation}`}
      </p>
      <button onClick={() => window.history.back()}>Back</button>
      <button onClick={() => deleteMarker(marker._id)}>Delete Marker</button>
    </div>
  )
}

export default SearchResultScreen;