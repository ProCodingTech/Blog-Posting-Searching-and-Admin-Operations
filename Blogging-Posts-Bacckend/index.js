const express = require ("express");
const mongoose = require("mongoose");
const app = express();
require("dotenv").config();

const userRoutes = require ("./Routes/UserRoutes")
const blogRoutes = require ("./Routes/BlogRoutes")

app.use(express.json());


app.listen(3000, ()=>{
    console.log("App is Running at port 3000");
})

app.use("/user", userRoutes);
app.use("/blog", blogRoutes);

// app.get("/", (req, res)=>{
//     res.status(200).json(message);
// })

mongoose.connect(process.env.MONGO_STRING).then(()=>{
    console.log("DB Connected");
}).catch(err =>{
    console.log(err);
})