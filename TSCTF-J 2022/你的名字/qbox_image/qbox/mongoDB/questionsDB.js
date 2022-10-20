const mongoose = require("mongoose")

let questionSchema = new mongoose.Schema({
    askerId: String,
    askeeId: String,
    question:String,
    answer:String,
    questionId:String
})

module.exports = mongoose.model("questions", questionSchema)