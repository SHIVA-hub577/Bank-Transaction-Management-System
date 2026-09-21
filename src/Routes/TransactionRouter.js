

const authmiddleware=require("../Middleware/authmiddleware");

const express=require("express");
const router=express.Router();

router.post("/",authmiddleware,transactioncontroler.createtransaction);