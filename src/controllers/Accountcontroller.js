const usermodel=require("../models/usermodel");
const accountmodel=require("../models/Accountmodel");

exports.CreateAccount=async(req,res,next)=>{
    const user=req.user;
    const useraccount=await accountmodel.create({
        user:user._id,
    })

    res.status(201).json({
        useraccount
    })
}