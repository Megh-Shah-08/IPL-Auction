import connectToMongo from "./db.js";
connectToMongo();
const User = require("./models/User");
const Team = require("./models/Team");
const Player = require("./models/Player");

const player = new Player({
  name: "Virat Kohli",
  basePrice: 2,
  sellPrice: 18,
});

const newPlayer = await player.save();

console.log(newPlayer);
