import './searchResultScreen.css';
import { useLocation } from 'react-router-dom';
import { extractAccomodations } from '../../services/googleAPIService';
import { useState, useEffect } from 'react';
import DBService from '../../services/DBService';

function SearchResultScreen() {
  const location = useLocation();
  const { marker } = location.state || {};
  const [nearAccommodation, setNearAccommodation] = useState([]);
  const [selectedAccommodation, setSelectedAccommodation] = useState("")


  useEffect(() => {
    if (marker.position) {
      const [lat, lon] = [marker.position.lat, marker.position.lng];
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

  const deleteMarker = (marker) => {
    DBService.removeMarker("aidan@test.com", marker._id);
  };

  return (
    <div className='searchResultScreen'>
        <h1>Search Result Screen</h1>
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
        <p>Wild Camping</p>
        <button onClick={() => updateAccommodation("Wild Camping")}>Select</button>
        </div>
      ) : (
        <p>No closest point data available.</p>
      )}
      <p>Selected accommodation: 
        {selectedAccommodation === "" ? " no accommodation selected" : ` ${selectedAccommodation}`}
      </p>
      <button onClick={() => window.history.back()}>Back</button>
      <button onClick={() => deleteMarker(marker.id)}>Delete Marker</button>
    </div>
  )
}

export default SearchResultScreen;