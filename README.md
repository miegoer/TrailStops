# TrailStops

TrailStops is a desktop based web application to plan out your long distance hikes, how long you'll walk each day and where you'll stop.

## Project Description

### Technologies

React - Easy to setup and customize. A bunch of relevant libraries are available that work with react and do what I needed.<br>
Express - Could of picked any backend framework but was happy with Express.<br>
Mongoose - No SQL based server was first choice due to users being able to generate any number of stops.<br>
Material UI - Used for basic user interface elements.<br>
Leaflet Maps - Library used to render map on screen. Free, open-source, and relatively pain free to work with.<br>
Leaflet-gpx - Library to convert GPX file route data to be useable format.<br>
react-router-dom - Used for client side routing and state management.<br>
Google Places API - Used for performing nearby search for relevant hotels/ campsites as well as to get general details and images.<br>

### Main Features
- User Registration and Login
- Interactable map
- Stop placement along pre-defined route.
- Accommodation search and save based on stop placement.
- Full Details Page and map page detail summary.
- Settings page to change walking speed

### Future Development Points
- More routes
- Show distance/time data before placing marker based on user mouse placement on screen along the route.
- Ability to only click on the route and nothing else to place markers more accurately
- Distance/ walking pace settings
- Accommodation Links
- proper login functionality (authentication, password hashing)

### Install and run app locally
1. fill in .env file
2. cd client, npm i
3. cd server, npm i
4. cd client, npm start
5. cd server, mpx tsx index.ts

### Project structure
/TrailStops<br>
├── client<br>
│   ├── public // imgs & gpx route data<br>
│   │   └── index.html // top level of react app<br>
│   ├── src<br>
│   │   ├── components<br>
│   │   ├── helperFunctions // mainly distance calculations and marker placement functions<br>
│   │   └── services // services to access the backend server API requests<br>
│   ├── app.js<br>
│   ├── index.js<br>
│   └── setupTests  // Jest tests<br>
├── server<br>
│   ├── controllers // fetch requests<br>
│   ├── models  // Mongoose setup<br>
│   ├── index.js  // Express setup<br>
│   └── router.js<br>
└── .env files  // API keys<br>
