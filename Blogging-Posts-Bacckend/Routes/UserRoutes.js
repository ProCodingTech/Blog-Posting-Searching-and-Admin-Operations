const {getAllUsers , GetUserById, Createuser, updateuserById, DeleteUserById, Login, followUser, blockUser, unfollowUser} = require("../Controllers/UserController")
const AuthenticateUser = require("../Controllers/authController")

const express = require("express");

const router = express.Router();

router.post("/createUser" , Createuser)

router.post("/login" , Login )

router.get("/getAllUsers" , AuthenticateUser ,  getAllUsers )

router.get("/getUserById/:id" , AuthenticateUser , GetUserById)

router.patch("/updateUser/:id" , AuthenticateUser , updateuserById)

router.delete("/deleteUser/:id" , AuthenticateUser ,DeleteUserById)

router.patch("/followUser", AuthenticateUser, followUser)

router.patch("/unfollowUser", AuthenticateUser, unfollowUser)

router.patch("/blockUser/:id", AuthenticateUser, blockUser)

module.exports = router;