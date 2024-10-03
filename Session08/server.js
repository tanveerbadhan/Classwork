const express = require("express");
const User = require("./models/user");
const app = express();
const port = process.env.PORT || 8080;

// setup sessions
const session = require("express-session");
app.use(
  session({
    secret: "the quick brown fox jumped over the lazy dog 1234567890", // random string, used for configuring the session
    resave: false,
    saveUninitialized: true,
  })
);

// tells express to use EJS
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));

// database
const mongoose = require("mongoose");
require("dotenv").config();

app.get("/", async (req, res) => {
  console.log(req.session);
  console.log(`Session id: ${req.sessionID}`);
  return res.status(200).render("index");
});

app.post("/signin", async (req, res) => {
  const emailFromUI = req.body.email;
  const passwordFromUI = req.body.password;
  try {
    let user = await User.find({
      username: emailFromUI,
    });

    if (user.length === 0) {
      return res.status(200).send("This User Doesn't Exist");
    }

    user = await User.find({
      password: passwordFromUI,
    });

    if (user.length === 0) {
      return res.status(200).send("Enter Correct Password");
    }

    if (user.length !== 0) {
      return res.status(200).send("Successfully logged in");
    }
    return res.status(200).send("Enter Correct Details");
  } catch (error) {
    return res.status(500).send(error.message);
  }
});

app.post("/signup", async (req, res) => {
  const emailFromUI = req.body.email;
  const passwordFromUI = req.body.password;
  const userTypeFromUI = req.body.usertype;
  try {
    const checkOldUsers = await User.find({ username: emailFromUI });

    if (checkOldUsers.length !== 0) {
      return res.status(200).send("User Already Exists");
    }
    const userToCreate = User({
      username: emailFromUI,
      password: passwordFromUI,
      usertype: userTypeFromUI,
    });
    await userToCreate.save();
    return res.status(200).send("Account got created");
  } catch (error) {
    return res.status(500).send(error.message);
  }
});

const startServer = async () => {
  console.log(`The server is running on http://localhost:${port}`);
  console.log(`Press CTRL + C to exit`);

  // MongoDB Connection
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Success! Connected to MongoDB");
  } catch (err) {
    console.error("Error connecting to MongoDB:", err);
  }
};
app.listen(port, startServer);
