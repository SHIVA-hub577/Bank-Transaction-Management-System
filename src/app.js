require("dotenv").config();
const express=require("express");
const ar=require("../src/Routes/Authrouter");
const accountrouter=require("../src/Routes/AccountRouter");
const app=express();
const cookie=require("cookie-parser");
app.use(express.json());
app.use(cookie());

app.use("/api/user",ar);
app.use("/api/account",accountrouter);
module.exports=app;