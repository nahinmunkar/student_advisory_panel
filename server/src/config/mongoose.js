/*
const mongoose = require("mongoose");
const dotenv = require("dotenv");

// dotenv config
dotenv.config();

mongoose.connect(
    process.env.MONGO_DB_URI,
    {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true,
        useFindAndModify: false,
    },
    () => {
        console.log("Connected to Database");
    }
);
*/
//


const mongoose = require("mongoose");
const dotenv = require("dotenv");

// Load environment variables
dotenv.config();

// MongoDB connection setup
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 20000,
    });
    console.log("Connected to Database");
  } catch (err) {
    console.error("Database connection error:", err);
    process.exit(1); // Exit process on failure
  }
};

// Remove deprecated options (not needed in Mongoose 6+):
// - useCreateIndex: true (deprecated)
// - useFindAndModify: false (deprecated)

module.exports = connectDB;




/*
const mongoose = require("mongoose");

const dotenv = require("dotenv");



// dotenv config

dotenv.config();



mongoose.connect(

    process.env.MONGO_DB_URI,

    {

        useNewUrlParser: true,

        useUnifiedTopology: true,

        useCreateIndex: true,

        useFindAndModify: false,

    },

    () => {

        console.log("Connected to Database");

    }

);


*/


/*
const mongoose = require("mongoose");

const dotenv = require("dotenv");



// Load environment variables

dotenv.config();



// MongoDB connection setup

const connectDB = async () => {

  try {

    const conn = await mongoose.connect(process.env.MONGODB_URI, {

      serverSelectionTimeoutMS: 30000,

      socketTimeoutMS: 45000,

      retryWrites: true,

    });



    console.log(`MongoDB Connected: ${conn.connection.host}`);

    

    // Add connection error handler

    mongoose.connection.on('error', (err) => {

      console.error('MongoDB connection error:', err);

    });



    // Add disconnection handler

    mongoose.connection.on('disconnected', () => {

      console.log('MongoDB disconnected, attempting to reconnect...');

    });



    return conn;

  } catch (err) {

    console.error('MongoDB connection failed:', err);

    // Don't exit process, let the application handle the error

    throw err;

  }

};



// Remove deprecated options (not needed in Mongoose 6+):

// - useCreateIndex: true (deprecated)

// - useFindAndModify: false (deprecated)



module.exports = connectDB;
*/