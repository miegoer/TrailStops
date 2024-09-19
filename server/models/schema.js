const mongoose = require('./');

const Schema = mongoose.Schema;

const userSchema = new Schema({
  name: String,
  email: String,
  password: String
});

const UserMapSchema = new Schema({
  user_id: String,
  points: Array,
  hotels: Array
});

const User = mongoose.model('User', userSchema);
const UserMap = mongoose.model('UserMap', UserMapSchema);

module.exports = { User, UserMap };