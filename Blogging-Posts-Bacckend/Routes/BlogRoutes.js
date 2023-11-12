const {postBlog, getAllBlogs, getBlogById, updateBlog, getBlogByKeyword, getBlogByCategory, getAllBlogsOfUser, getMyBlogs, disableBlog, enableBlog, deleteBlog, commentBlog, deleteCommentBlog, rateBlog, readBlogById, readFollowingBlogs} = require ("../Controllers/BlogController")
const AuthenticateUser = require("../Controllers/authController")
const express = require ("express");

const router = express.Router();

router.post("/postBlog", AuthenticateUser, postBlog)

router.get("/allBlogs", AuthenticateUser, getAllBlogs)

router.get("/getBlogById/:id", AuthenticateUser, getBlogById)

router.patch("/updateBlog/:id", AuthenticateUser, updateBlog)

router.get("/getBlogByKeyword", getBlogByKeyword)

router.get("/getBlogByCategory", getBlogByCategory)

router.get("/getAllBlogsOfUser/:id", getAllBlogsOfUser)

router.get("/getMyBlogs", AuthenticateUser, getMyBlogs)

router.put("/disableBlog/:id", AuthenticateUser, disableBlog)

router.put("/enableBlog/:id", AuthenticateUser, enableBlog)

router.delete("/delBlog/:id", AuthenticateUser, deleteBlog)

router.put("/commentBlog/:id", AuthenticateUser, commentBlog)

router.put("/delComment/:id", AuthenticateUser, deleteCommentBlog)

router.put("/rateBlog/:id", AuthenticateUser, rateBlog)

router.get("/readBlogById/:id", readBlogById)

router.get("/readFollowingBlogs", AuthenticateUser, readFollowingBlogs)

module.exports = router;