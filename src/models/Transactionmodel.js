const mongoose=require("mongoose");

const transactionschema=new mongoose.Schema({
    fromAccount:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"account",
        required:[true,"fromAccount is required"],
        index:true
    },

    toAcccount:{
       type:mongoose.Schema.Types.ObjectId,
        ref:"account",
        required:[true,"ToAccount is required"],
        index:true 
    },
    status:{
        type:String,
         enum:{
            values:["PENDING",'COMPLETED','FAILED','REVERSED'],
            message:"Status is required"
         },
         default:"PENDING"
    },
    amount:{
        type:Number,
        required:[true,"Amount is required"],
        min:[0,"Transaction Amount Cannot be negative"]
    },
    idempotencykey:{
        type:String,
        required:[true,"idempotencykey is required"],
        unique:true,
        index:true
    }

},{timestamps:true})
const transactionmodel=mongoose.model("transaction",transactionschema);
module.exports=transactionmodel;