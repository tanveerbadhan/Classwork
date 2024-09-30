const express = require("express");
const Student = require("./models/student");
const app = express();
const port = process.env.PORT || 8080;

// tells express to use EJS
app.set("view engine", "ejs");

// database
const mongoose = require("mongoose");
require("dotenv").config();

// If the server receives a request at / , respond by sending back the string "HELLO WORLD"
app.get("/", async (req, res) => {
  try {
    const s = Student({
      name: "Ram Singh",
      gpa: 2.3,
      tuitionPaid: true,
    });
    await s.save();
    return res.status("200").send("Student is successfully added");
  } catch (error) {
    return res.status(500).send(error.message);
  }
});

app.get("/all", async (req, res) => {
  try {
    const studentList = await Student.find();
    return res.status("200").send(JSON.stringify(studentList));
  } catch (error) {
    return res.status(500).send(error.message);
  }
});

app.get("/:name", async (req, res) => {
  try {
    const studentList = await Student.find({ name: req.params.name });
    return res.status("200").send(JSON.stringify(studentList));
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
