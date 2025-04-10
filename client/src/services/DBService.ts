import { MarkerType, SettingsType } from "../types/types";

async function getMarkers (user_id: string) {
  try {
    const response = await fetch(`http://localhost:3001/mapMarkers?user_id=${user_id}`);
    const data = await response.json();
    return data;
  } catch (error) {
    console.log("Error fetching markers:", error);
  }
}

async function addMarker (user_id: string, marker: MarkerType, updatedMarkers: MarkerType[], settings: SettingsType ) {
  try {
    const _id = marker._id
    const response = await fetch('http://localhost:3001/mapMarkers', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({_id: _id, user_id: user_id, marker: marker, updatedMarkers: updatedMarkers, settings: settings}),
  })
  const data = await response.json();
  return data;
  } catch (error) {
    console.log("Error adding marker:", error);
  }
}

async function updateAllMarkers (markers: MarkerType[]) {
  try {
    const response = await fetch('http://localhost:3001/updateAllMarkers', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({markers: markers})
    })
    const data = await response.json();
    return data;
  } catch (error) {
    console.log("Error updating markers:", error)
  }
}

async function addUser (name: string, email: string, password: string) {
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

async function getUser (email: string) {
  try {
    const response = await fetch(`http://localhost:3001/user?email=${email}`);
    const data = await response.json();
    return data;
  } catch (error) {
    console.log("Error fetching user:", error);
  }
}

async function getAccommodation (email: string, markerId: string) {
  try {
    const response = await fetch(`http://localhost:3001/accommodation?user_id=${email}&markerId=${markerId}`);
    const data = await response.json();
    return data;
  } catch (error) {
    console.log("Error fetching user:", error);
  }
}

async function addAccommodation(email: string, hotel: string, markerId: string) {
  try {
    const response = await fetch('http://localhost:3001/accommodation', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ user_id: email, hotel: hotel, markerId: markerId }),
    });

    const data = await response.json();
    return data;
  } catch (error) {
    console.log("Error adding accommodation:", error);
  }
}

async function removeMarker(userId: string, markerId: string) { 
  try {
    const response = await fetch('http://localhost:3001/mapMarkers', {
      method:'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({user_id: userId,_id: markerId}),
    })
    const data = await response.json();
    return data;
  } catch (error) {
    console.log("Error removing marker:", error);
  }
}

const DBService = { getMarkers, addMarker, updateAllMarkers, addUser, getUser, getAccommodation, addAccommodation, removeMarker };
export default DBService;