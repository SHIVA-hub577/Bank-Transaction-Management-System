const usermodel=require("../models/usermodel");
const Jwt=require("jsonwebtoken");
const { sendWelcomeEmail } = require("../services/Emailservices");

exports.userpostregister=async (req,res,next)=>{
    const {email,name,password}=req.body;
    const isExists=await usermodel.findOne({email});
    if(isExists){
        return res.status(400).json({
            success:false,
            message:"User Already exists"
        })
    }

    const user=await usermodel.create({email,name,password});

    // Trigger welcome email notification asynchronously
    sendWelcomeEmail(user.email, user.name);

    const token=await Jwt.sign({userId:user._id,},process.env.JWT_SECRET,{expiresIn:"3d"})
    res.cookie("token", token, {
    httpOnly: true,
    secure: true,
        sameSite: "Strict"
    });
    
    res.status(201).json({
        message:"User registered successfully",
        user:{
            userid: user._id,
            email:user.email,
            name:user.name
        },
        token
    })

    
}


exports.userlogin= async (req,res,next)=>{
    const {email,password}=req.body;
    
    const user=await usermodel.findOne({email}).select("+password");
    const isMatched=await user.comparepassword(password);
    if(!isMatched){
        return res.status(401).json(
           {
            message:"Invalid Credentials",
           }
        )
    }
     const token=await Jwt.sign({userId:user._id,},process.env.JWT_SECRET,{expiresIn:"3d"})
    res.cookie("token",token);
    
    res.status(201).json({
        message:"User LoggedIn successfully",
        user:{
            userid: user._id,
            email:user.email,
            name:user.name
        },
        token
    })

}