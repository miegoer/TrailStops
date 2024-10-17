 async function getNearAccommodations(lat: number, lng: number) {
  try {
    const response = await fetch(`http://localhost:3001/getAccommodation?lat=${lat}&lon=${lng}`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.log("Error fetching accommodations:", error);
  }
}

async function extractAccommodations (lat: number, lng: number) {
  const data = await getNearAccommodations(lat, lng);
  const { results } = data;
  if (results.length <= 0) {
    return null;
  }
  let outputArr = []
  for (let i = 0; i < results.length; i++) {
    if (!results[i].photos) {
      continue;
    }
    const url  = await fetchAccommodationPicture(results[i].photos[0].photo_reference);
    const { name, vicinity } = results[i]
    outputArr[i] = { name, url, vicinity }; 
  }
  return outputArr;
}

async function fetchAccommodationPicture(photoReference: string) {
  const response = await fetch(`http://localhost:3001/accommodationPic?photo_reference=${photoReference}`);
  if (!response.ok) {
    throw new Error("Image not found");
  }// Create an object URL for the blob
  return await response.json();
}

const APIService = { extractAccommodations }
export default APIService