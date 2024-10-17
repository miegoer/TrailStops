import express from 'express';
import { getGoogleAccommodation, getAccommodationPic, getAccommodationDetails } from './controllers/apiController';
import { getMarkers, addMarker, updateAllMarkers, addUser, getUser, getAccommodation, addAccommodation, removeMarker } from './controllers/DBController';
const router = express.Router();


router.get('/mapMarkers', (req, res) => {
  getMarkers(req, res);
});

router.post('/mapMarkers', (req, res) => {
  addMarker(req, res);
})

router.put('/updateAllMarkers', (req, res) => {
  updateAllMarkers(req, res);
})

router.delete('/mapMarkers', (req, res) => {
  removeMarker(req, res);
})

router.post('/user', (req, res) => {
  addUser(req, res);
})

router.get('/user', (req, res) => {
  getUser(req, res);
})

router.get('/accommodation', (req, res) => {
  getAccommodation(req, res);
})

router.put('/accommodation', (req, res) => {
  addAccommodation(req, res);
})

router.get('/getAccommodation', (req, res) => {
  getGoogleAccommodation(req, res);
});

router.get('/accommodationPic', (req, res) => {
  getAccommodationPic(req, res);
});

router.get('/getAccommodationDetails', (req, res) => {
  getAccommodationDetails(req, res);
});


export default router