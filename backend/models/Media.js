const mongoose = require("mongoose");

const MediaSchema = new mongoose.Schema({
  type:String,
  url:String,
  createdAt:{
    type:Date,
    default:Date.now
  }
});

module.exports = mongoose.model("Media",MediaSchema);