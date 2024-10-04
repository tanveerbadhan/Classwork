const express = require("express")
const app = express()
const port = process.env.PORT || 8080

// tells express to use EJS
app.set("view engine", "ejs")

// - extract data sent by <form> element in the client
app.use(express.urlencoded({extended:true}))

// setup sessions
const session = require('express-session')
app.use(session({
   secret: "the quick brown fox jumped over the lazy dog 1234567890",  // random string, used for configuring the session
   resave: false,
   saveUninitialized: true
}))

// database
const mongoose = require("mongoose");
require("dotenv").config();

// import the User
const User = require("./models/usermodel")

app.get("/", (req,res) => {
    return res.render("home.ejs")
})

app.get("/profile", (req,res)=>{
    return res.render("profile.ejs")
})

app.get("/faq", (req,res)=>{
    return res.render("faq.ejs")
})

app.get("/delete", (req,res)=>{    
    return res.send("SUCCESS: User deleted!")
})

app.get("/reviews", (req,res)=>{    
    return res.render("review.ejs")
})

app.post("/leave-review", (req, res)=> {
    console.log("DEBUG")
    console.log(req.body)
    return res.send("Review added!")
})


const startServer = async () => {   
   console.log(`The server is running on http://localhost:${port}`)
   console.log(`Press CTRL + C to exit`)

   // MongoDB Connection
   try {
        await mongoose.connect(process.env.MONGODB_URI)
        console.log("Success! Connected to MongoDB")
    } catch (err) {
        console.error("Error connecting to MongoDB:", err);
    }  

}
app.listen(port, startServer)