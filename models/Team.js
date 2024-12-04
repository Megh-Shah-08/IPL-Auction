const mongoose = require("mongoose");

const teamSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  purse: {
    type: Number,
    required: true,
    max: 120,
    min: 0,
  },
});

const Team = new mongoose.model('Team',teamSchema);

module.exports = Team;