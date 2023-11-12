const users = require ("../Models/User.schema")
const blogs = require ("../Models/Blog.schema")
const jwt = require ("jsonwebtoken")

let postBlog = (req, res)=>{
    let data = req.body;

    const token = req.headers.token;

    if (!token) {
        return res.status(401).json({ Message: 'Authentication token is missing.' });
    }

    const decode = jwt.verify(token, process.env.SECRET_KEY);

    let authId = decode.id;
    let authName = decode.name;

    // console.log("Author Id: ", authId, " Name: ",authName);

    blogs.create({
        Author :{
            authorId : authId,
            authorName :  authName
        },
        BlogText : data.BlogText,
        BlogHeading : data.BlogHeading,
        Keywords : data.Keywords || [],
        Categories : data.Categories || [],
    })
    .then(data=>{
        res.status(201).json(data._doc)
    })
    .catch(err=>{
        res.status(500).json({"There is some error: ":err.messsage});
    })
}

const getAllBlogs = async(req, res)=>{
    let token = req.headers.token;
    const decode = jwt.verify(token, process.env.SECRET_KEY);

    let isAdmin = decode.Admin;

    if(isAdmin){
        let allBlogs = await blogs.find({});
        if(allBlogs){
            res.status(200).json(allBlogs)
        }
        else{
            res.status(404).json({Message : err.messsage})
        }
    }
    else{
        res.status(404).json({Message : "You are not Admin. And have no access to Retrieve all Blogs"})
    }
}

const getBlogById = async (req, res)=>{
    const Id = req.params.id;

    let token = req.headers.token;
    const decode = jwt.verify(token, process.env.SECRET_KEY);

    let isAdmin = decode.Admin;

    if(isAdmin){
        let findBlog = await blogs.findOne({_id:Id});
        if(findBlog){
            res.status(200).json(findBlog)
        }
        else{
            res.status(404).json({Message : err.messsage})
        }
    }
    else{
        res.status(404).json({Message : "You are not Admin. And have no access to Retrieve a sepcific Blog."})
    }
}

const updateBlog = async (req, res)=>{
    let Id = req.params.id;
    let data = req.body;

    let token = req.headers.token;
    const decode = jwt.verify(token, process.env.SECRET_KEY);

    let admin = decode.Admin;
    let tokenID = decode.id;

    let blog = await blogs.findOne({_id:Id});
    let authId = blog.Author.authorId;

    let compare = (tokenID == authId);

    // console.log("User Id: ",tokenID);

    if(admin || compare){
        let update = await blogs.findByIdAndUpdate(Id, data);
        if(update){
            res.status(200).json(update)
        }
        else{
            res.status(404).json({Message : "Error in updating Blog."})
        }
    }
    else{
        res.status(404).json({Message : "Neither you are Admin nor Author of that Blog. So, you cannot update this Blog."})
    }
}

const getBlogByKeyword = async (req, res)=>{
    const {keywords} = req.query;
    // console.log("Keywords: ",keywords);

    if (!keywords) {
        return res.status(400).json({ Message: "Keywords parameters missing." });
    }

    // const keywordArray = keywords.split(',');
    const keywordArray = keywords.split(',').map(keyword => new RegExp(keyword.trim(), 'i'));
    // console.log("Keywords Array: ",keywordArray);

    try{
        const blogFound = await blogs.find({ Keywords: { $elemMatch: {$in: keywordArray}}});
        // console.log("Found Blog: ",blogFound);
        if(blogFound && blogFound.length > 0){
            const filteredBlogs = blogFound.filter(blog => !blog.Disabled);
            if (filteredBlogs.length > 0){
                res.status(200).json(filteredBlogs);
            }
            else {
                res.status(404).json({ Message: "Blogs with this keyword is Disabled by Admin." });
            }
            // res.status(200).json(blogFound)
        }
        else{
            res.status(404).json({Message:"No Blogs with this keyword."});
        }
    }
    catch(err){
        res.status(404).json(err.messsage);
    }
}

const getBlogByCategory = async (req, res)=>{
    const {categories} = req.query;
    // console.log("categories: ",categories);

    if (!categories) {
        return res.status(400).json({ Message: "Categories parameters missing." });
    }

    const categoriesArray = categories.split(',').map(category => new RegExp(category.trim(), 'i'));
    // console.log("Categories Array: ",categoriesArray);

    try{
        const blogFound = await blogs.find({ Categories: { $elemMatch: {$in: categoriesArray}}});
        // console.log("Found Blog: ",blogFound);
        if(blogFound && blogFound.length > 0){
            const filteredBlogs = blogFound.filter(blog => !blog.Disabled);
            if (filteredBlogs.length > 0){
                res.status(200).json(filteredBlogs);
            }
            else {
                res.status(404).json({ Message: "Blogs with this Category is Disabled by Admin." });
            }
        }
        else{
            res.status(404).json({Message:"No Blogs with this Category."});
        }
    }
    catch(err){
        res.status(404).json(err.messsage);
    }
}

const getAllBlogsOfUser = async(req, res)=>{
    let UID = req.params.id;

    try{
        let findBlogs = await blogs.find({ 'Author.authorId': UID });

        if(findBlogs){
            const filteredBlogs = findBlogs.filter(blog => !blog.Disabled);
            if (filteredBlogs.length > 0){
                res.status(200).json(filteredBlogs);
            }
            else {
                res.status(404).json({ Message: "All blogs of this User are Disabled by Admin." });
            }
        }
        else{
            res.status(404).json({Message : "No Blogs of a user."})
        }
    }
    catch(err){
        res.status(404).json(err.messsage);
    }

}

const getMyBlogs = async(req, res)=>{
    let token = req.headers.token;
    let decode = jwt.verify(token, process.env.SECRET_KEY);

    let myID = decode.id;

    try{
        let findBlogs = await blogs.find({ 'Author.authorId': myID });
        if(findBlogs && findBlogs.length > 0){
            res.status(200).json(findBlogs);
        }
        else{
            res.status(404).json({Message : "No Blogs of a user."})
        }
    }
    catch(err){
        res.status(404).json(err.messsage)
    }
}

const disableBlog = async(req, res)=>{
    let blogId = req.params.id;
    let token = req.headers.token;

    const decode = jwt.verify(token, process.env.SECRET_KEY);
    let isAdmin = decode.Admin;
    try{
        if(isAdmin){
            let blogToDisable = await blogs.findOne({_id : blogId})
            if(blogToDisable){
                await blogs.updateOne(
                    { _id: blogId },
                    {$set: {Disabled: true}}
                );
                res.status(201).json({Message : "Blog Blocked Successfully........."})
            }
            else{
                res.status(400).json({Message : "Blog not Found."})
            }
        }
        else{
            res.status(400).json({Message : "You are not Admin."})
        }
    }
    catch(err){
        res.status(404).json(err.messsage)
    }
}

const enableBlog = async(req, res)=>{
    let blogId = req.params.id;
    let token = req.headers.token;

    const decode = jwt.verify(token, process.env.SECRET_KEY);
    let isAdmin = decode.Admin;
    try{
        if(isAdmin){
            let blogToDisable = await blogs.findOne({_id : blogId})
            if(blogToDisable){
                await blogs.updateOne(
                    { _id: blogId },
                    {$set: {Disabled: false}}
                );
                res.status(201).json({Message : "Blog UnBlocked Successfully........."})
            }
            else{
                res.status(400).json({Message : "Blog not Found."})
            }
        }
        else{
            res.status(400).json({Message : "You are not Admin."})
        }
    }
    catch(err){
        res.status(404).json(err.messsage)
    }
}

const deleteBlog = async(req, res)=>{
    let blogId = req.params.id;
    let token = req.headers.token;

    const decode = jwt.verify(token, process.env.SECRET_KEY);
    const isAdmin = decode.Admin;

    let personID = decode.id;

    const blogDel = await blogs.findOne({_id : blogId});
    if (!blogDel) {
        return res.status(404).json({ Message: "Blog not found." });
    }
    // console.log("Blog is: ",blogDel);

    let authID = blogDel.Author.authorId;
    // console.log("Author ID: ",authID);

    let compareID = (personID == authID);

    try{
        if(isAdmin || compareID){
            let delBlog = await blogs.findByIdAndDelete(blogId);
            if(delBlog){
                res.status(201).json({Message : "Blog Deleted Successfully.",BlogHeading : delBlog.BlogHeading ,BlogText :delBlog.BlogText})
            }
            else{
                res.status(404).json({Message : "There is some error in deleting Blog."})
            }
        }
        else{
            res.status(400).json({Message : "Not an admin or Author of this blog. You can't delete this Blog."})
        }
    }
    catch(err){
        res.status(404).json(err.messsage)
    }
}

const commentBlog = async(req, res)=>{
    let blogId = req.params.id;
    let {text} = req.body;

    let token = req.headers.token;
    const decode = jwt.verify(token, process.env.SECRET_KEY);

    let uID = decode.id;
    let uName = decode.name;

    try{
        const blogComment = await blogs.findOne({_id : blogId});
        if(!blogComment){
            return res.status(404).json({Error : "Blog Not Exist."})
        }
        await blogs.updateOne(
            {_id : blogId},
            {$push: { Comments: {userId : uID, userName : uName, commentText : text}}}
        );

        const updatedBlog = await blogs.findOne({ _id: blogId });

        res.status(201).json({ "You: ": uName, "Commented:  ": text,"On Blog: ": updatedBlog.BlogText});
    }
    catch(err){
        res.status(404).json(err.messsage)
    }
}

const deleteCommentBlog = async(req, res)=>{
    let blogId = req.params.id;
    // let commentId = req.params.commentId;

    let token = req.headers.token;
    const decode = jwt.verify(token, process.env.SECRET_KEY);

    let uID = decode.id;
    let uName = decode.name;

    let isAdmin = decode.Admin;

    try{
        const blogComment = await blogs.findOne({_id : blogId});

        if(!blogComment){
            return res.status(404).json({Error : "Blog Not Exist."})
        }
        
        const commentIndex = blogComment.Comments.findIndex(comment => comment.userId === uID);

        if (commentIndex === -1) {
            return res.status(404).json({ Error: "Comment Not Found." });
        }

        const authorize = blogComment.Comments[commentIndex].userId;
        let compare = (uID === authorize);
        // console.log("Commenter ID: ", authorize);
        if(isAdmin || compare){
            await blogs.updateOne(
                {_id : blogId},
                {$pull: { Comments: {userId : uID}}}
            );
    
            // const updatedBlog = await blogs.findOne({ _id: blogId });
    
            res.status(201).json({ Message : "Comment Deleted Successfully."});
        }
        else{
            res.status(404).json({Messsage : "You are not authorized to delete this Comment."});
        }
    }
    catch(err){
        res.status(404).json(err.messsage)
    }
}

const rateBlog = async(req, res)=>{
    try{
        let blogId = req.params.id;
        let {rate} = req.body;

        let token = req.headers.token;
        const decode = jwt.verify(token, process.env.SECRET_KEY);

        let uID = decode.id;
        let uName = decode.name;

    
        const blogRate = await blogs.findOne({_id : blogId});
        // console.log("blog found");
        if(!blogRate){
            return res.status(404).json({Error : "Blog Not Exist."})
        }
        if(rate >= 0 && rate <= 5){
            // console.log("updating");
            await blogs.updateOne(
                {_id : blogId},
                {$push: { Rating: {userId : uID, userName : uName, rated : rate}}}
            );
            // console.log("updated");
        }
        else{
            res.status(400).json({Message: "Please, rate in range from 0-5"});
        }
        

        const updatedBlog = await blogs.findOne({ _id: blogId });

        res.status(201).json({ "You: ": uName, "Rated:  ": rate,"On Blog: ": updatedBlog.BlogText});
    }
    catch(err){
        res.status(404).json({Message : err.messsage})
    }

}

const readBlogById = async (req, res)=>{
    const Id = req.params.id;

    // let token = req.headers.token;
    // const decode = jwt.verify(token, process.env.SECRET_KEY);

    // let isAdmin = decode.Admin;

    // if(isAdmin){
    let findBlog = await blogs.findOne({_id:Id});
    let author = findBlog.Author.authorName;
    let heading = findBlog.BlogHeading;
    let text = findBlog.BlogText;
    let commentsName;
    let commentText
    const blogComments = findBlog.Comments.map(comment => ({
        userName: comment.userName,
        commentText: comment.commentText
    }));

    // console.log("Comments: ",commentsName,commentText);
    if(findBlog){
        res.status(200).json({"Author" : author, "Blog Heading" : heading, "Blog Text" : text, "Blog Comments" : blogComments})
    }
    else{
        res.status(404).json({Message : "Blog Not Found."})
    }
}

const readFollowingBlogs = async(req, res)=>{
    
    const token = req.headers.token;
    const decode = jwt.verify(token, process.env.SECRET_KEY);
    const userId = decode.id;

    const user = await users.findById(userId);
    if (!user) {
        return res.status(404).json({ Message: "User not found." });
    }
    try {
        console.log('User Object:', user);
        const followingAuthors = user.Following.map((following) => following.followingId);

        console.log('Authors:', followingAuthors);
      
        const followingBlogs = await blogs.find({ 'Author.authorId': { $in: followingAuthors } });
        console.log('Blogs:', followingBlogs);
      
        res.status(200).json({ FollowingBlogs: followingBlogs });
      } catch (error) {
        console.error('Error in readFollowingBlogs:', error);
        res.status(500).json({ message: 'Internal Server Error' });
      }
}

// const rateBlog = async (req, res) => {
//     try {
//         console.log("Start rateBlog");

//         let blogId = req.params.id;
//         let { rate } = req.body;

//         let token = req.headers.token;
//         const decode = jwt.verify(token, process.env.SECRET_KEY);

//         let uID = decode.id;
//         let uName = decode.name;

//         const blogRate = await blogs.findOne({ _id: blogId });

//         console.log("Blog found:", blogRate);

//         if (!blogRate) {
//             console.log("Blog not found");
//             return res.status(404).json({ Error: "Blog Not Exist." });
//         }

//         if (rate >= 0 && rate <= 5) {
//             console.log("Valid rating");

//             await blogs.updateOne(
//                 { _id: blogId },
//                 { $push: { Rating: { userId: uID, userName: uName, rated: rate } } }
//             );

//             console.log("Rating added successfully");

//             const updatedBlog = await blogs.findOne({ _id: blogId });

//             return res.status(201).json({
//                 Message: "Rating added successfully.",
//                 You: uName,
//                 Rated: rate,
//                 OnBlog: updatedBlog.BlogText
//             });
//         } else {
//             console.log("Invalid rating");
//             return res.status(400).json({ Message: "Please, rate in the range from 0 to 5" });
//         }
//     } catch (err) {
//         console.error("Error in rateBlog:", err);
//         return res.status(500).json({ Message: "Internal Server Error" });
//     }
// };


module.exports = {
    postBlog,
    getAllBlogs,
    getBlogById,
    updateBlog,
    getBlogByKeyword,
    getBlogByCategory,
    getAllBlogsOfUser,
    getMyBlogs,
    disableBlog,
    enableBlog,
    deleteBlog,
    commentBlog,
    deleteCommentBlog,
    rateBlog,
    readBlogById,
    readFollowingBlogs
}