import mongoose from 'mongoose';

const url = 'mongodb://localhost:27017/TrailStops';

async function main() {
  await mongoose.connect(url);
};

main();

module.exports = mongoose;