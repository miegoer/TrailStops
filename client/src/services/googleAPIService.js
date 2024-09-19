 async function getNearAccommodations(lat, lng) {
  try {
    const response = await fetch(`http://localhost:3001/getAccomodation?lat=${lat}&lon=${lng}`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.log("Error fetching accommodations:", error);
  }
}

export async function extractAccomodations (lat, lng) {
  const data = await getNearAccommodations(lat, lng);
    const { results } = data;
    if (results.length <= 0) {
      return null;
    }
    let outputArr = []
    for (let i = 0; i < results.length; i++) {
      const { name } = results[i]
      outputArr[i] = name
    }
    return outputArr;
}