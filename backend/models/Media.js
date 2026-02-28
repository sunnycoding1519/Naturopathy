const mongoose = require("mongoose");

const MediaSchema = new mongoose.Schema({
  type:{
    type:String,
    required:true
  },
  url:{
    type:String,
    required:true
  }
},{
  timestamps:true
});

module.exports = mongoose.model("Media",MediaSchema);