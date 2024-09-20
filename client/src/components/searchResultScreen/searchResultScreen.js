import './searchResultScreen.css';
import { useLocation } from 'react-router-dom';
import { extractAccomodations } from '../../services/googleAPIService';
import { useState, useEffect } from 'react';
import DBService from '../../services/DBService';

function SearchResultScreen() {
  const location = useLocation();
  const { closestPoint, index } = location.state || {};
  const [nearAccommodation, setNearAccommodation] = useState([]);
  const [selectedAccommodation, setSelectedAccommodation] = useState("")


  useEffect(() => {
    if (closestPoint) {
      const [lat, lon] = closestPoint;
      extractAccomodations(lon, lat)
        .then((data) => {
          setNearAccommodation(Array.isArray(data) ? data : []);

        })
      }
       if (index >= 0) {
        DBService.getAccommodation("aidan@test.com")
        .then((data) => {
          setSelectedAccommodation(data.hotels[index]);
        })
      }
  }, []);

  function updateAccommodation (accommodation) {
    setSelectedAccommodation(accommodation)
    DBService.addAccommodation("aidan@test.com", accommodation, index)
  }

  return (
    <div className='searchResultScreen'>
        <h1>Search Result Screen</h1>
      {closestPoint ? (
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
      <button>Delete Marker</button>
    </div>
  )
}

export default SearchResultScreen;