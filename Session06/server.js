const express = require("express");
const app = express();
const port = process.env.PORT || 8080;

// tells express to use EJS
app.set("view engine", "ejs");

// database
const mongoose = require("mongoose");
require("dotenv").config();

// If the server receives a request at / , respond by sending back the string "HELLO WORLD"
app.get("/", (req, res) => {
  return res.send("HELLO WORLD!");
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
