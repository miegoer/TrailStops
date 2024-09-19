const express = require('express');
const router = express.Router();
const Accomodation = require('./controllers/apiController');

router.get('/getAccomodation', (req, res) => {
  Accomodation.getAccomodation(req, res);
});

module.exports = router;