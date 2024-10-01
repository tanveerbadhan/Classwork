const express = require("express");
const Student = require("./models/student");
const app = express();
const port = process.env.PORT || 8080;

// tells express to use EJS
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));

// database
const mongoose = require("mongoose");
require("dotenv").config();

// If the server receives a request at / , respond by sending back the string "HELLO WORLD"

app.get("/", async (req, res) => {
  return res.status("200").render("home");
});

app.get("/addStudent", async (req, res) => {
  try {
    return res.status("200").render("addStudent");
  } catch (error) {
    return res.status(500).send(error.message);
  }
});

app.post("/insert", async (req, res) => {
  try {
    const student = Student({
      name: req.body.nameTextBox,
      gpa: parseFloat(req.body.gpaTextBox),
      tuitionPaid: req.body.hasOwnProperty("tuitionCheckBox"),
    });
    student.save();
    return res.status("200").send("Succefully Added a student");
  } catch (error) {
    return res.status(500).send(error.message);
  }
});

app.get("/all", async (req, res) => {
  try {
    const studentList = await Student.find();
    return res
      .status("200")
      .render("all", { studentList, labelInternalText: "" });
  } catch (error) {
    return res.status(500).send(error.message);
  }
});

app.get("/studentName/:name", async (req, res) => {
  try {
    const studentList = await Student.find({ name: req.params.name });
    return res.status("200").send(JSON.stringify(studentList));
  } catch (error) {
    return res.status(500).send(error.message);
  }
});

app.get("/studentGpa/:gpa", async (req, res) => {
  try {
    const studentList = await Student.find({ gpa: { $gte: req.params.gpa } });
    if (studentList.length === 0) {
      return res.send("There are no matching students");
    }
    return res.send(JSON.stringify(studentList));
  } catch (error) {
    return res.status(500).send(error.message);
  }
});

app.get("/highscores", async (req, res) => {
  try {
    const studentList = await Student.find({ gpa: { $gte: 3.1 } });
    return res
      .status("200")
      .render("all", { studentList, labelInternalText: "High Score" });
  } catch (error) {
    return res.status(500).send(error.message);
  }
});

app.get("/update", async (req, res) => {
  try {
    const student = await Student.findByIdAndUpdate(
      "66fb2a7ef5c2bf300908decf",
      { name: "Tanveer" },
      { new: true }
    );
    return res.send("Successfully updated");
  } catch (error) {
    return res.status(500).send(error.message);
  }
});

app.get("/delete", async (req, res) => {
  try {
    const student = await Student.findByIdAndDelete("66fb3b7be54d2f4b4fb1c1f8");
    return res.send(`Successfully Deleted`);
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
