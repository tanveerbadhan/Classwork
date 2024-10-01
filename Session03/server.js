const express = require("express")
const app = express()
const port = process.env.PORT || 8080

app.set('view engine', 'ejs')

// If the server receives a request at / , respond by sending back the string "HELLO WORLD"
app.get("/", (req,res) => {
  return res.render("example.ejs")
})


const startServer = () => {
  console.log(`The server is running on http://localhost:${port}`)
  console.log(`Press CTRL + C to exit`)
}
app.listen(port, startServer)