const jwt=require("jsonwebtoken");
const usermodel=require("../models/usermodel");

exports.AuthMiddleware=async(req,res,next)=>{
   const token=req.cookies.token || req.headers.authorization?.split(" ")[1];

   if(!token){
    return res.status(401).json({
        message:'Unauthorised User,Token is missing'
    })
   }

   try{
    const decode=jwt.verify(token,process.env.JWT_SECRET);
    const user=await usermodel.findById(decode.userId);
      req.user=user;
      return next();
   }
   catch{
   res.status(401).json({
    message:"Unauthroised Access,Invalid Token"
   })
   }
}