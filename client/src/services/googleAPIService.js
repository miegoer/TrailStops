export async function getNearAccommodations(lat, lng) {
  try {
    const response = await fetch(`http://localhost:3001/getAccomodation?lat=${lat}&lon=${lng}`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json(); // Assuming the response is in JSON format
    return data;
  } catch (error) {
    console.log("Error fetching accommodations:", error);
  }
}