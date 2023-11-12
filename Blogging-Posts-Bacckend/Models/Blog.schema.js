const mongoose = require ("mongoose")

const blogSchema = mongoose.Schema({
    Author : {authorId : String, authorName : String},
    BlogText : String,
    BlogHeading : String,
    Rating : [{userId : String, userName : String, rated : Number}],
    Keywords : [String],
    Categories : [String],
    Comments : [{userId : String, userName : String, commentText : String}],
    Disabled : {type : Boolean, default : false},
},{timestamps : true});

const model = mongoose.model("Blogs", blogSchema);
module.exports = model;