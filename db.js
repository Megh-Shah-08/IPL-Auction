const mongoose = require("mongoose");
require("dotenv").config();
const mongoURL = process.env.MONGO_URI;

const connectToMongo = () => {
  mongoose
    .connect(mongoURL,{
      serverSelectionTimeoutMS: 30000,
    })
    .then(() => {
      console.log("Connected to DB Succesfully!");
    })
    .catch((err) => {
      console.log("There was an error! : " + err);
    });
};

module.exports = connectToMongo;