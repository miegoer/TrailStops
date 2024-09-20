async function getMarkers (user_id) {
  try {
    const response = await fetch(`http://localhost:3001/mapMarkers?user_id=${user_id}`);
    const data = await response.json();
    return data;
  } catch (error) {
    console.log("Error fetching markers:", error);
  }
}

async function addMarker (user_id, points) {
  try {
  const response = await fetch('http://localhost:3001/mapMarkers', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({user_id: user_id, points: points}),
  })
  const data = await response.json();
  return data;
  } catch (error) {
    console.log("Error adding marker:", error);
  }
}

async function addUser (name, email, password) {
  try {
    const response = await fetch('http://localhost:3001/user', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({name: name, email: email, password: password}),
    })
    const data = await response.json();
    return data;
  } catch (error) {
    console.log("Error adding user:", error);
  }
}

async function getUser (email) {
  try {
    const response = await fetch(`http://localhost:3001/user?email=${email}`);
    const data = await response.json();
    return data;
  } catch (error) {
    console.log("Error fetching user:", error);
  }
}

async function getAccommodation (email) {
  try {
    const response = await fetch(`http://localhost:3001/accommodation?user_id=${email}`);
    const data = await response.json();
    return data;
  } catch (error) {
    console.log("Error fetching user:", error);
  }
}

async function addAccommodation (email, hotels) {
  try {
    let response1 = await fetch(`http://localhost:3001/accommodation?user_id=${email}`);
    response1 = await response1.json()
    console.log(response1);
    response1 = [...response1.hotels, hotels]
    const response2 = await fetch ('http://localhost:3001/accommodation', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({user_id: email, hotels: response1}),
    })
    const data = await response2.json();
    return data;
  } catch (error) {
    console.log("Error adding user:", error);
  }
}

const DBService = { getMarkers, addMarker, addUser, getUser, getAccommodation, addAccommodation };
export default DBService;