const { User, UserMap } = require('../models/schema');

exports.getMarkers = async (req, res) => {
  try {
    const { user_id } = req.query;
    const response = await UserMap.findOne({ user_id });
    res.status(200).json(response.points);
  } catch (error) {
    res.status(500).send("Server Error");
  }
}

exports.addMarker = async (req, res) => {
  try {
    const { user_id, points} = req.body;
    const response = await UserMap.updateOne({user_id: user_id}, {points: points});
    res.status(200).json(response);
  } catch (error) {
    res.status(500).send("Server Error");
  }
}
// TODO: add password hashing
exports.addUser = async (req, res) => {
  try {
  const { name, email, password } = req.body;
  const newUser = new User({ name, email, password });
  const newUserMap = new UserMap({ user_id: newUser.email, points: [], hotels: [] });
  const mapResponse = await newUserMap.save();
  const response = await newUser.save();
  res.status(200).json(response);
  } catch (error) {
    res.status(500).send("Server Error");
  }
}

exports.getUser = async (req, res) => {
  const { email } = req.query;
  const user = await User.findOne({ email });
  res.status(200).json(user);
}

exports.getAccommodation = async (req, res) => {
  try {
  const { user_id } = req.query;
  const response = await UserMap.findOne({ user_id });
  console.log(response.hotels)
  res.status(200).json(response);
  } catch (error) {
    res.status(500).send("Server Error");
  }
}

exports.addAccommodation = async (req, res) => {
  try {
    const { user_id, hotels } = req.body;
    const response = await UserMap.updateOne({user_id: user_id}, {hotels: hotels});
    res.status(200).json(response);
  } catch (error) {
    res.status(500).send("Server Error");
  }
}