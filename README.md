# TrailStops

TrailStops is a desktop based web application to plan out your long distance hikes, how long you'll walk each day and where you'll stop.

## Project Description

### Technologies

React - Easy to setup and customize. A bunch of relevant libraries are available that work with react and do what I needed.
Express - Could of picked any backend framework but was happy with Express.
Mongoose - No SQL based server was first choice due to users being able to generate any number of stops.
Material UI - Used for basic user interface elements as I suck at CSS.
Leaflet Maps - Library used to render map on screen. Free, open-source, and relatively pain free to work with.
Leaflet-gpx - Library to convert GPX file route data to be useable format.
react-router-dom - Used for routing and state management.
Google Places API - Used for performing nearby search for relevant hotels/ campsites as well as to get general details and images. Their image fetching docs could really use some work though.

### Main Features
- User Registration and Login
- Interactable map
- Stop placement along pre-defined route.
- Accommodation search and save based on stop placement.
- Full Details Page and map page detail summary.

### Future Development Points
- More routes
- Show distance/time data before placing marker based on user mouse placement on screen along the route.
- distance/ walking pace settings
- Accommodation Links

### Install and run app locally
1. cd client, npm i
2. cd server, npm i
3. cd client, npm start
4. cd server, node index.js