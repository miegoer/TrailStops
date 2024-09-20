const express = require('express');
const router = express.Router();
const Accomodation = require('./controllers/apiController');
const DB = require('./controllers/DBController')

router.get('/getAccomodation', (req, res) => {
  Accomodation.getAccomodation(req, res);
});

router.get('/mapMarkers', (req, res) => {
  DB.getMarkers(req, res);
});

router.post('/mapMarkers', (req, res) => {
  DB.addMarker(req, res);
})

router.post('/user', (req, res) => {
  DB.addUser(req, res);
})

router.get('/user', (req, res) => {
  DB.getUser(req, res);
})

router.get('/accommodation', (req, res) => {
  DB.getAccommodation(req, res);
})

router.post('/accommodation', (req, res) => {
  DB.addAccommodation(req, res);
})

module.exports = router;