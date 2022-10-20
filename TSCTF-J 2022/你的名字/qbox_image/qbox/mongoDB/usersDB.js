const mongoose = require("mongoose")

let userSchema = new mongoose.Schema({
    username: String,
    password: String,
    userId:String
})

module.exports = mongoose.model("users", userSchema)

