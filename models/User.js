const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  usertype: {
    type: String,
    required: true,
    enum: ["admin", "viewer"],
  },
});

const User = new mongoose.model('User',userSchema);

module.exports = User;
