const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
   username: { type: String },
   password: { type: String },   
   usertype: { type: String }
}, { timestamps: true });

module.exports = mongoose.model("User", userSchema);

