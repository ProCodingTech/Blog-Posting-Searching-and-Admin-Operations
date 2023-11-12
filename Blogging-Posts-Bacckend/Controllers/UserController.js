const user = require("../Models/User.schema")
const jwt = require("jsonwebtoken")

let getAllUsers = async(req , res)=>{
    id = res.locals.id;
    let token = req.headers.token;
    let decode = jwt.verify(token, process.env.SECRET_KEY);

    let role = decode.Admin;

    if(role){
        let users = await user.find({});
        if(users)
        {
            res.status(200).json(users)
        }
        else
        {
            res.status(404).json({Message:"Error" , err:err})
        }
    }
    else{
        res.status(404).json({Message:"Not an Admin"})
    }
}

let GetUserById = async(req ,res)=>{
    let id = req.params.id;
    let users = await user.findOne({_id:id});
    if(users)
    {
        let name = users.FullName;
        let mail = users.email;
        let followers = [users.Followers]
        let following = [users.Following]
       res.status(200).json({name, mail, followers, following})
    }else
    {
      res.status(404).json({Message:"Error" , err:err})
    }
}



let Createuser = (req , res)=>{
    let data = req.body;

    user.create({
        FullName:data.FullName,
        email:data.email,
        Password:data.Password,
        isAdmin:data.isAdmin,
    })
    .then(data=>{
        res.status(201).json(data._doc)
    })
    .catch(err=>{
        res.status(500).json({"Message":"There was Some Error ", err})
    })
}

let updateuserById = async(req ,res)=>{
    let id = req.params.id;
    let data = req.body;

    let token = req.headers.token;
    let decode = jwt.verify(token, process.env.SECRET_KEY);

    let UserID = decode.id;

    if(id == UserID){
        let users = await user.findByIdAndUpdate(id , data);
        if(users){
            res.status(200).json(users)
        }
        else{
            res.status(404).json({"Message":"Error" , err:err})
        }
    }
    else{
        res.status(404).json({ Message : "Warning.!!! No Authority to Update this Account."})
    }
}

let DeleteUserById =  async(req ,res)=>{
    let id = req.params.id;

    let token = req.headers.token;
    let decode = jwt.verify(token, process.env.SECRET_KEY);

    let delID = decode.id;

    let isAdmin = decode.Admin;
    let compare = (delID == id);

    if(isAdmin || compare){
        let users = await user.findByIdAndDelete(id);
        if(users){
            let delname = decode.name;
            res.status(200).json({"User: ": delname , "Deleted Successfully." : true})
        }
        else{
            res.status(404).json({"Message":"Error" , err:err})
        }
    }
    else{
        res.status(404).json({ Message : "Warning.!!! No Authority to Delete this Account."})
    }
}

let Login = async(req , res)=>{
    let {email , Password} = req.body;
    // console.log(Password)
    // console.log(req.body)
    try{
        let User = await user.findOne({email});
        // console.log(User)
        if(User)
        {
            if(Password === User.Password )
            {
                // let {Password , ...rest} = User
                let id = User._id;
                let Admin = User.isAdmin
                let name = User.FullName;
                let token = await jwt.sign(
                    {id , Admin, name},
                    process.env.SECRET_KEY,
                    {expiresIn :'48h'}
                )
                res.status(200).json({"Success":true , token,"User Id: ":id})
            }else
            {
                res.json({ "Success":false , "Message":"Invalid password. Or You may be Blocked by Admin."})

            }
        }else
        {
            res.json({ "Success":false , "Message":"User not Found"})

        }
    }catch(err)
    {
        res.json({"Success":false , "Message":"User not Found" , err})
        
    }
    
}

/*const followUser = async (req, res)=>{
    try{
        let toFollowId = req.params.id;

        const token = req.headers.token;
        let decode = jwt.verify(token, process.env.SECRET_KEY);

        let currentUser = decode.id;
        //let thisUser = user.findOne({currentUser});

        console.log("To Follow: ",toFollowId);
        console.log("Current User: ",currentUser);

        const userToFollow = await user.findOne({ _id: toFollowId });
        console.log("User to follow: ",userToFollow);

        if (!userToFollow) {
            return res.status(404).json({ "Error": "User to follow not found" });
        }else{
            await user.updateOne(
                { _id: toFollowId },
                { $push: { Followers: currentUser } }
            );

            
            await user.updateOne(
                { _id: currentUser },
                { $push: { Following: toFollowId } }
            );

            const thisUser = await user.findOne({ _id: currentUser });
            console.log("Follower: ",thisUser);
            res.status(201).json(userToFollow,thisUser) 
        }

        // console.log("First work done");

        // const thisUser = await user.findOne({ _id: currentUser });
        // console.log("Follower: ",thisUser);

        // // Add toFollowId to the Followers array of the current user
        // await user.updateOne(
        //     { _id: currentUser },
        //     { $addToSet: { Following: toFollowId } }
        // );

        // res.status(201).json(thisUser);
    
        // let User = await user.findOne({toFollowId});
        // if(User){
        //     user.updateOne([
        //         {$push:{Followers:{toFollowId}}}
        //     ])
        //     res.status(201).json(thisUser)
        // }
    }
    catch(err){
        res.status(404).json({"Error ": err})
    }
}*/

const followUser = async (req, res) => {
    try {
        const { toFollowId } = req.body;
        let token = req.headers.token;
        let decode = jwt.verify(token, process.env.SECRET_KEY);

        const userToFollow = await user.findOne({ _id: toFollowId });
        let currentUserId = decode.id;

        const thisUser = await user.findOne({ _id: currentUserId });

        let userToFollowName = userToFollow.FullName;
        let thisUserName = thisUser.FullName;

        // console.log("Celebrity: ",userToFollowName);
        // console.log("Follower: ",thisUserName);
        
        if (!userToFollow) {
            return res.status(404).json({ "Error": "User to follow not found." });
        }
        else {

            await user.updateOne(
                { _id: toFollowId },
                { $push: { Followers: {id: currentUserId, name: thisUser.FullName} } }
            );

            await user.updateOne(
                { _id: currentUserId },
                { $push: { Following: {id: toFollowId, name: userToFollow.FullName} } }
            );

            await user.findOne({ _id: toFollowId });
            await user.findOne({ _id: currentUserId });

            res.status(201).json({ "You ": thisUserName, "Successfully Followed ": userToFollowName});
        }
    } catch (err) {
        res.status(500).json({ "Catch Error": err.message });
    }
};

const unfollowUser = async(req, res)=>{
    const {toUnfollowId} = req.body;
    let token = req.headers.token;
    const decode = jwt.verify(token, process.env.SECRET_KEY);
    // console.log("un id:  ", toUnfollowId);

    let currentId = decode.id;
    // console.log(currentId);

    try{
        const userToUnfollow = await user.findOne({_id : toUnfollowId});
        let unfollowName = userToUnfollow.FullName;

        if(!userToUnfollow){
            return res.status(404).json({Error : "User Not Exist."})
        }

        let currentUser = await user.findOne({_id : currentId});
        let currentName = currentUser.FullName;

        await user.updateOne(
            {_id : currentId},
            {$pull: { Following: {name: unfollowName}}}
        )
        // { Following: {id: toUnfollowId, name: unfollowName}}   { Followers: {id: currentId, name: currentName}}
        await user.updateOne(
            {_id : toUnfollowId},
            {$pull : { Followers: {name: currentName}}}
        )

        res.status(201).json({Message : "Successfully Unfollowed ", unfollowName})

    }
    catch(err){
        res.status(500).json({ Error : "Oops! Server Error" });
    }

}

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

let blockUser = async (req, res)=>{
    const token = req.headers.token;
    let id = req.params.id;

    const decodeToken = jwt.verify(token, process.env.SECRET_KEY);

    let isAdmin = decodeToken.Admin;
    let randomInteger = getRandomInt(1, 100);
    const newPassword = randomInteger + "youAreBlockedByAdmin";

    if (isAdmin){
        const blockID = await user.findOne({_id:id})
        if (blockID){
            await user.updateOne(
                { _id: id },
                {$set: {Password: newPassword}}
            );
            res.status(201).json({Message : "User Blocked Successfully........."})
        }
        else{
            return res.status(404).json({ Error: "User not found." });
        }
    }
    else{
        return res.status(404).json({ Error: "You are not an admin. Have no authority to Block any User." });
    }

}


module.exports  = {
    GetUserById,
    getAllUsers,
    updateuserById,
    DeleteUserById,
    Createuser,
    Login,
    followUser,
    blockUser,
    unfollowUser
}