const mongoose = require("mongoose")

const userSchema = mongoose.Schema({
    FullName : String,
    email : String,
    Password : String,
    isAdmin:{type : Boolean, default : false},
    Followers:[{followerId:String, name:String}],
    Following:[{followingId:String, name:String}],

},{timestamps:true})
const model = mongoose.model("User" , userSchema);
module.exports = model;