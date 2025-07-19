const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
    //   useNewUrlParser: true,       // optional in Mongoose 6+
    //   useUnifiedTopology: true     // optional in Mongoose 6+
    });
    console.log('MongoDB connected successfully');
  } catch (err) {
    console.error('❌ MongoDB connection failed:', err.message);
    process.exit(1); // Stop the server if DB connection fails
  }
};

module.exports = connectDB;
