import './searchResultScreen.css';
import { useLocation } from 'react-router-dom';
import { extractAccomodations } from '../../services/googleAPIService';
import { useState, useEffect } from 'react';

function SearchResultScreen() {
  const location = useLocation();
  const { closestPoint } = location.state || {};
  const [nearAccommodation, setNearAccommodation] = useState([]);

  useEffect(() => {
    if (closestPoint) {
      const [lat, lon] = closestPoint;
      extractAccomodations(lon, lat)
        .then((data) => {
          // Ensure data is an array
          setNearAccommodation(Array.isArray(data) ? data : []);
        })
      } else {
        // Handle the case where closestPoint is not available
        setNearAccommodation([]);
      }
  }, []);

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
              <button onClick={() => console.log(accommodation)}>Select</button>
              </div>
            ))
              
          ) : (
            <p>No accommodation found.</p>
          )}
        </ul>
        <p>Wild Camping</p>
        <button onClick={() => console.log('wildcamping')}>Select</button>
        </div>
      ) : (
        <p>No closest point data available.</p>
      )}
      <button onClick={() => window.history.back()}>Back</button>
    </div>
  )
}

export default SearchResultScreen;