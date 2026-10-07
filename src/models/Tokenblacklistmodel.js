const mongoose=require("mongoose");

const tokenblacklistschema=new mongoose.Schema({
    token:{
        type:String,
        required:[true,"token is required"],
        unique:[true,'Token is already blacklisted']
    }


},{
    timestamps:true
});

tokenblacklistschema.index({createdAt:1},{expireAfterSeconds:60*60*24*3});

const tokenblacklistmodel=mongoose.model("tokenblacklist",tokenblacklistschema);

module.exports=tokenblacklistmodel;