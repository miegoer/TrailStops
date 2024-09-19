import './searchResultScreen.css';
import { useLocation } from 'react-router-dom';

function SearchResultScreen() {
  const location = useLocation();
  const { closestPoint } = location.state || {};

  return (
    <div className='searchResultScreen'>
        <h1>Search Result Screen</h1>
      {closestPoint ? (
        <p>Closest Point: Latitude {closestPoint[1]}, Longitude {closestPoint[0]}</p>
      ) : (
        <p>No closest point data available.</p>
      )}
    </div>
  )
}

export default SearchResultScreen;