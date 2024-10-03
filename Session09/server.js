const express = require("express");
const app = express();
const port = process.env.PORT || 8080;

// tells express to use EJS
app.set("view engine", "ejs");

// - extract data sent by <form> element in the client
app.use(express.urlencoded({ extended: true }));

// setup sessions
const session = require("express-session");
app.use(
  session({
    secret: "the quick brown fox jumped over the lazy dog 1234567890", // random string, used for configuring the session
    resave: false,
    saveUninitialized: true,
  })
);

// database
const mongoose = require("mongoose");
require("dotenv").config();

// import the User
const User = require("./models/usermodel");

// custom middleware
// function that will execute BEFORE your (req,res)=>{}
// 1. check the endpoint name
// 2. execute whatever is in the req,res

// 1. check the endpoint name
// 2. execute your custom function (middleware) that checks if the user is logged in
// 3. execute whatever is in the req,res

// 1. create a middleware function
const demo = (req, res, next) => {
  // check if someone is logged in
  console.log("HELLO+++++");
  console.log("HELLO+++++");
  console.log("HELLO+++++");
  console.log("HELLO+++++");
  console.log("HELLO+++++");
  console.log("HELLO+++++");
  // after doing the above, continue on with whatever is in the endpoint
  next();
};

// 2. middleware function to check if the person is logged in
const checkIfUserIsLoggedIn = (req, res, next) => {
  if (req.session.hasOwnProperty("loggedInUser") === true) {
    // if the user is logged in, then continue on with whatever is in the req,res
    next();
  } else {
    // otherwise; show an error; ask them to login
    // return res.send("ERROR: You must be logged in to see this page.")
    // send them back to the / endpoint because that endpoint shows the login page
    console.log(
      "DEBUG:  User are not logged in, so send them to the login page"
    );
    return res.redirect("/");
  }
};

// before executing the req,res, check if the user is logged in
app.get("/prices", checkIfUserIsLoggedIn, (req, res) => {
  // 2. are you a rider?
  if (req.session.loggedInUser.usertype === "rider") {
    // 3. if yes, then show the pricing
    const randomPrice = Math.floor(Math.random() * (30 - 10 + 1) + 10);
    return res.send(
      `The current cost of a ride is: $${randomPrice.toFixed(2)}`
    );
  } else {
    return res.send(
      `ERROR: Only riders can see this page. You are a ${req.session.loggedInUser.usertype}`
    );
  }
});

app.get("/profile", checkIfUserIsLoggedIn, (req, res) => {
  return res.render("profile.ejs");
});

app.get("/pickup", checkIfUserIsLoggedIn, (req, res) => {
  if (req.session.loggedInUser.usertype === "driver") {
    // 3. if yes, then show the pricing
    return res.send(
      "Drive to 165 Kendal Avenue. The passenger is waiting at the Tim Hortons."
    );
  } else {
    return res.send(
      `ERROR: Only drviers can see this page. You are a ${req.session.loggedInUser.usertype}`
    );
  }
});

app.get("/delete", (req, res) => {
  // 1. are you logged in AND you need to be a rider (order matters)
  if (req.session.loggedInUser.usertype === "admin") {
    return res.send("SUCCESS: User deleted!");
  } else {
    return res.send(
      `ERROR: Only admins can see this page. You are a ${req.session.loggedInUser.usertype}`
    );
  }
});

app.get("/", demo, (req, res) => {
  console.log("DEBUG: What's in req.session?");
  console.log(req.session);
  console.log(`Session id: ${req.sessionID}`);
  return res.render("home.ejs");
});

app.get("/faq", demo, (req, res) => {
  return res.render("faq.ejs");
});

app.get("/reviews", (req, res) => {
  return res.render("review.ejs");
});

app.post("/leave-review", (req, res) => {
  console.log("DEBUG");
  console.log(req.body);
  return res.send("Review added!");
});

app.get("/logout", (req, res) => {
  // delete the entire session
  req.session.destroy();
  console.log("LOGGED OUT!!! Redirecting you back to the / endpoint");
  return res.redirect("/");
});

app.post("/login", async (req, res) => {
  console.log("DEBUG: Data from login form:");
  console.log(req.body);

  try {
    const results = await User.find({ username: req.body.txtEmail });

    if (results.length === 0) {
      return res.send("ERROR: This user does not exist");
    }

    const userFromDB = results[0];

    if (userFromDB.password === req.body.txtPassword) {
      req.session.loggedInUser = userFromDB;
      return res.send("SUCCESS: You are logged in!");
    } else {
      return res.send("ERROR: Incorrect username or password");
    }
  } catch (err) {
    return res.status(500).send(err.message);
  }
});

app.post("/signup", async (req, res) => {
  console.log("DEBUG: Data from signup form:");
  console.log(req.body);

  const emailFromUI = req.body.txtEmail;
  const passwordFromUI = req.body.txtPassword;

  const results = await User.find({ username: emailFromUI });
  console.log(results);
  console.log(`What is the length: ${results.length}`);

  if (results.length === 0) {
    try {
      const userToCreate = User({
        username: emailFromUI,
        password: passwordFromUI,
        // usertype: role
        usertype: req.body.txtUserType,
      });

      await userToCreate.save();
      return res.send("SUCCESS: User created");
    } catch (err) {
      return res.status(500).send(err.message);
    }
  } else {
    return res.send(`ERROR: SORRY this user already exists: ${emailFromUI}`);
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
