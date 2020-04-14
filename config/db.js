const mongoose = require("mongoose");
const config = require("config");

const db = "mongodb://JaspreetSingh:jaspreet1999@ds237832.mlab.com:37832/medicaps";

const connectDB = async () => {
  try {
    await mongoose.connect(db, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
      useFindAndModify: false
    });
    console.log("Mongodb connected...");
  } catch (err) {
    console.error(err.message);
    // Exit process with failure
    process.exit(1);
  }
};

module.exports = connectDB;
