const mongoose=require("mongoose");
const bcrypt=require("bcryptjs");

const userschema=new mongoose.Schema({
    email:{
        type:String,
        required:[true,"Email is Required to enter"],
        unique:[true,"Email Laready Registered"],
        lowercase:true,
        trim:true,
        match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Please fill a valid email address']
    },
    name:{
         type:String,
        required:[true,"Username is Required to enter"],
  
    },
    password:{
        type:String,
        required:[true,"Password is Required to enter"],
        minlength:[6,"Password should have minimum length of 6 characetrs"],
        select:false
    }

},{
    timestamps:true
})

userschema.pre('save',async function(){
    if(!this.isModified('password')){
        return 
    }

    this.password=await bcrypt.hash(this.password,10);
    return 
})

userschema.methods.comparepassword=async function(password){
    return await bcrypt.compare(password,this.password);
}

const Usermodel=mongoose.model('user',userschema);
module.exports=Usermodel;