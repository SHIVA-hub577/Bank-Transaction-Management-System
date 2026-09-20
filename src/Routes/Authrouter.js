const express=require("express");
 const ar=express.Router();

 const ac=require("../controllers/Authcontroller");
ar.post("/register",ac.userpostregister);
ar.get("/login",ac.userlogin);

 module.exports=ar;