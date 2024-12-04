const mongoose = require("mongoose");

const playerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  basePrice: {
    type: Number,
    required: true,
  },
  sellPrice: {
    type: Number,
    required: true,
  },
  team: {
    type: String,
    required: true,
    enum: ["CSK", "DC", "GT", "KKR", "LSG", "MI", "PBKS", "RR", "RCB", "SRH"],
  },
});

const Player = new mongoose.model("Player", playerSchema, "players");

module.exports = Player;
