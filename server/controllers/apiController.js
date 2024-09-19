require('dotenv').config({path: '.env'});

exports.getAccomodation = async (req, res) => {
  try {
    const { lon, lat } = req.query;
    const apiKey = process.env.GOOGLE_API_KEY;
    const response = await fetch(`https://maps.googleapis.com/maps/api/place/nearbysearch/json?key=${apiKey}&location=${lat},${lon}&radius=500&type=lodging`);
    const data = await response.json();
    res.status(200).json(data)
  } catch (error) {
    console.log(error);
    res.status(500).send("Server Error");
  }
}