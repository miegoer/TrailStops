const mongoose = require('mongoose');

const URL = 'mongodb://localhost:27017/TrailStops';

async function main() {
  await mongoose.connect(URL, {useNewUrlParser: true});
};

main();

module.exports = mongoose;