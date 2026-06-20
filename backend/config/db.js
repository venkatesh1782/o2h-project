const mongoose = require('mongoose');

const connectDB = async () => {
  const dbUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/project_portal';
  
  try {
    console.log('Connecting to MongoDB...');
    const conn = await mongoose.connect(dbUri, { serverSelectionTimeoutMS: 2500 });
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    process.env.USE_MOCK_DB = 'false';
  } catch (error) {
    console.warn(`Local MongoDB connection failed: ${error.message}`);
    console.warn('>>> Switching to local JSON-file Database (mock db) fallback <<<');
    process.env.USE_MOCK_DB = 'true';
  }
};

module.exports = connectDB;
