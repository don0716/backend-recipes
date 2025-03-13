const mongoose = require("mongoose");
require("dotenv").config();

const mongoUri = process.env.MONGODB;

const initializeDatabase = async () => {
  await mongoose
    .connect(mongoUri)
    .then(() => {
      console.log("Connected to Database");
    })
    .catch((error) => console.log("Error connecting to Database.", error));
};
module.exports = { initializeDatabase };

// Basic Code to Connect to Any Database.
//  1. (npm init -y) in terminal
//  2. Database connection will depend on the mongoUri. Your .env file will have your mongoDb database URL.
//  3. Must install npm mongoose and npm dotenv in terminal.
//  4. Next Make the Model.
