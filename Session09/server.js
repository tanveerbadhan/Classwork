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
    console.log("DEBUG: What's in req.session?")
    console.log(req.session)
    console.log(`Session id: ${req.sessionID}`)
    return res.render("home.ejs")
})


app.get("/profile", (req,res)=>{
    return res.render("profile.ejs")
})

app.get("/faq", (req,res)=>{
    return res.render("faq.ejs")
})

app.get("/prices", (req,res)=>{    
    const randomPrice = Math.floor(Math.random() * (30 - 10 + 1) + 10)
    return res.send(`The current cost of a ride is: $${randomPrice.toFixed(2)}`)
})

app.get("/pickup", (req,res)=>{    
    return res.send("Drive to 165 Kendal Avenue. The passenger is waiting at the Tim Hortons.")
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







app.get("/logout", (req,res)=>{
    // delete the entire session
    req.session.destroy()
    console.log("LOGGED OUT!!! Redirecting you back to the / endpoint")
    return res.redirect("/")
})

app.post("/login", async (req,res)=>{
    console.log("DEBUG: Data from login form:")
    console.log(req.body)
   
    try {
        const results = await User.find({username:req.body.txtEmail})
        
        if (results.length === 0) {
            return res.send("ERROR: This user does not exist")
        }

        const userFromDB = results[0]

        if (userFromDB.password ===  req.body.txtPassword) {
            req.session.loggedInUser = userFromDB
            return res.send("SUCCESS: You are logged in!")
        }        
        else {
            return res.send("ERROR: Incorrect username or password")
        }
    } catch (err) {
        return res.status(500).send(err.message)
    }    
})


app.post("/signup", async (req,res)=>{
    console.log("DEBUG: Data from signup form:")
    console.log(req.body)
    
    const emailFromUI = req.body.txtEmail
    const passwordFromUI = req.body.txtPassword

    const results = await User.find({username: emailFromUI})
    console.log(results)
    console.log(`What is the length: ${results.length}`)

    if (results.length === 0) {
        try {
            const userToCreate = User({
                username: emailFromUI,
                password: passwordFromUI,
                // usertype: role
                usertype: req.body.txtUserType             
            })

            await userToCreate.save()
            return res.send("SUCCESS: User created")
        } catch (err) {
            return res.status(500).send(err.message)
        }        
    } else {

        return res.send(`ERROR: SORRY this user already exists: ${emailFromUI}`)
    }
    
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