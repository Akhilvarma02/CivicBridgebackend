require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');

const cleanupDatabase = async () => {
  try {
    // Connect to MongoDB
    console.log("Connecting to MongoDB for Cleanup...");
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/civicbridge');
    console.log("Connected Successfully.");

    // Delete all users who do not have inherently Verified status
    // Matches { isVerified: false } AND documents where isVerified doesn't exist
    const deletionResult = await User.deleteMany({ isVerified: { $ne: true } });

    console.log(`\n================================`);
    console.log(`CLEANUP COMPLETE`);
    console.log(`Deleted ${deletionResult.deletedCount} unverified legacy user(s).`);
    console.log(`Your MongoDB User collection is now perfectly clean.`);
    console.log(`================================\n`);

    // Force disconnect
    mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error("Cleanup script failed:", error.message);
    mongoose.disconnect();
    process.exit(1);
  }
};

// Execute sequence
cleanupDatabase();
