const serverless = require("serverless-http");
const express = require("express");
const app = express();
const path = require("path");
const port = 3000;
const connectToMongo = require("./db");
const User = require("./models/User");
const Team = require("./models/Team");
const Player = require("./models/Player");
const mongoose = require("mongoose");
const methodOverride = require("method-override");
app.use(methodOverride("_method"));
let userType = "viewer";
connectToMongo();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "../../views"));
//GET Request to get the form to login
app.get("/login", async (req, res) => {
  console.log("Login requested");
  res.render("auth/login.ejs");
});

//POST Request to create the new user
app.post("/login", async (req, res) => {
  const { username, usertype } = req.body;

  const newUser = new User({
    username: username,
    usertype: usertype,
  });
  userType = usertype;
  const user = await newUser.save();
  console.log(`${newUser.username} : ${newUser.usertype} Logged In!`);
  res.redirect("/");
});

//GET Request for Home Route
app.get("/", async (req, res) => {
  const teams = await Team.find();
  //   console.log(teams);
  res.render("home.ejs", { teams, userType });
});

//POST Request to create the new player
app.post("/player", async (req, res) => {
  const { name, basePrice, sellPrice, team } = req.body;

  const newPlayer = new Player({
    name: name,
    basePrice: basePrice,
    sellPrice: sellPrice,
    team: team,
  });
  // console.log(team);

  const player = await newPlayer.save();

  const foundTeam = await Team.findOne({ name: team });
  //   console.log(foundTeam);
  let newPurse = foundTeam.purse - sellPrice;
  //   console.log(foundTeam.purse);
  //   console.log(newPurse);
  const teamUpdate = await Team.findByIdAndUpdate(
    foundTeam._id,
    { purse: newPurse },
    { new: true, runValidators: true }
  );
  // console.log(teamUpdate);
  //   res.send(player);
  console.log(`${player.name} : ${player.sellPrice} : ${player.team} Added!`);
  res.redirect(`/team/${foundTeam._id}`);
});

//GET Request to show specific team details
app.get("/team/:id", async (req, res) => {
  const { id } = req.params;
  const team = await Team.findById(id);
  //   console.log(team);
  const players = await Player.find({ team: team.name });
  //   console.log(players);
  res.render("team/show.ejs", { team, players, userType });
});

//GET Request to show the form to create new user
app.get("/player", async (req, res) => {
  res.render("player/new.ejs");
});

//DELETE Request to delete the player from record
app.delete("/player/:id/delete", async (req, res) => {
  const { id } = req.params;
  const playerDeleted = await Player.findByIdAndDelete(id);
  //   console.log('deleted!');
  // console.log(playerDeleted);
  const playerPrice = playerDeleted.sellPrice;
  const team = playerDeleted.team;
  const foundTeam = await Team.findOne({ name: team });
  const newPurse = foundTeam.purse + playerPrice;

  const teamUpdate = await Team.findByIdAndUpdate(
    foundTeam._id,
    { purse: newPurse },
    { new: true, runValidators: true }
  );
  // console.log(teamUpdate);
  //   res.send(player);
  console.log(`${playerDeleted.name} Deleted`);
  res.redirect(`/team/${foundTeam._id}`);
});

app.get("/max", async (req, res) => {
  const players = await Player.aggregate([
    {
      $sort: { sellPrice: -1 },
    },
    {
      $group: {
        _id: "$team",
        mostExpensivePlayer: { $first: "$name" },
        highestPrice: { $max: "$sellPrice" },
      },
    },
  ]);
  // console.log(players);
  res.render("max", { players });
});

try {
  app.listen(port, () => {
    console.log(`IPL Auction listening at Port ${port}!`);
  });
} catch (error) {
  console.log(error);
}
