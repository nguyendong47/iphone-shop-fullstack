const mongoose = require('mongoose');
require('dotenv').config();

const MAX_RETRIES = 3;
const RETRY_INTERVAL = 5000; // 5 seconds

const connectDB = async (retries = MAX_RETRIES) => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('MongoDB connected successfully.');
  } catch (error) {
    if (retries > 0) {
      console.error(
        `Error connecting to MongoDB. Retrying in ${
          RETRY_INTERVAL / 1000
        } seconds...`,
      );
      setTimeout(() => connectDB(retries - 1), RETRY_INTERVAL);
    } else {
      console.error(
        'Failed to connect to MongoDB after multiple attempts:',
        error.message,
      );
      process.exit(1);
    }
  }
};

module.exports = connectDB;
