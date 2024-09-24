import './detailSummary.css';

function DetailSummary({ markers }) {
  const sortedMarkers = Object.values(markers || {}).sort((a, b) => a.order - b.order);
  

  return (
    <div className="detailSummary">
      <img className="markerIcon" src='marker-icon-2x.png' alt='marker icon' style={{ marginBottom: '10px' }}/>
      <p>Start</p>
      <p className='emoji'>&#128315;</p> 
        {sortedMarkers[0].prevDist ? (
          <>
            <p>{sortedMarkers[0].prevDist.dist} kms/{sortedMarkers[0].prevDist.time} hrs </p>
            <p className='emoji'>&#128315;</p>
          </>   
        ) : "No markers placed!"}
      <div className="summary">
        {sortedMarkers && Object.values(sortedMarkers).length > 0 ? (
          Object.values(markers).map((marker) => (
            <div className="marker" key={marker._id}>
              <img className="markerIcon" src='map-pin.svg' alt='marker icon' />
              <div className="markerInfo">
                <p>{marker.nextDist?.dist} kms/{marker.nextDist?.time} hrs</p>
                <p className='emoji'>&#128315;</p>
              </div>
            </div>
          ))
        ) : (
          <div>No markers</div>
        )}
        <img className="markerIcon" src='marker-icon-2x.png' alt='marker icon' />
        <p>End</p>
      </div>
    </div>
  );
}

export default DetailSummary;
