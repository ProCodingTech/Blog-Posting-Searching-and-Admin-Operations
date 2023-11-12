const jwt = require("jsonwebtoken")

let AuthenticateUser = async (req, res, next)=>{
    const token = req.headers.token;

    // console.log("Token is: ",token);
    const decode = jwt.verify(token, process.env.SECRET_KEY);
    // console.log(decode);

    if(decode){
        const UserId = decode.id;
        const Admin  = decode.Admin;
        res.locals.userId = UserId;
        res.locals.admin = Admin;
        next()
    }
    else{
        res.json("Wrong Credentials")
    }

}

module.exports = AuthenticateUser;