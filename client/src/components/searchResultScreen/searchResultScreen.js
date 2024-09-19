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
        <ul>
          {nearAccommodation && nearAccommodation.length > 0 ? (
            nearAccommodation.map((accommodation, index) => (
              <li key={index}>{accommodation}</li>
            ))
          ) : (
            <p>No accommodations found.</p>
          )}
        </ul>
      ) : (
        <p>No closest point data available.</p>
      )}
    </div>
  )
}

export default SearchResultScreen;