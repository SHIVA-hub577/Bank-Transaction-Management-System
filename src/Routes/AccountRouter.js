const express=require("express");
const accountrouter=express.Router();
const accountcontroller=require("../controllers/Accountcontroller");
const AuthMiddleware=require("../Middleware/authmiddleware");

accountrouter.post("/",AuthMiddleware.AuthMiddleware,accountcontroller.CreateAccount);
module.exports=accountrouter;