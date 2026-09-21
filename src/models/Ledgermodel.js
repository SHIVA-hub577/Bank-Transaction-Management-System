const mongoose=require("mongoose");

const Ledgerschema=new mongoose.Schema({
    account:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"account",
        required:true,
        index:true,
        immutable:true
    },
    transactionId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"transaction",
        required:true,
        index:true,
        immutable:true
    },
    amount:{
        type:Number,
        required:true,
        index:true,
        immutable:true
    },
    type:{
        type:String,
        enum:{
            values:["CREDIT","DEBIT"],
            message:"Type is required"
        },
        required:true,
        index:true,
        immutable:true
    }

},{timestamps:true})

const preventLedgermodification(){
    throw new Error("Ledger Cannot be Modified");
}

Ledgerschema.pre("findOneAndUpdate",preventLedgermodification);
Ledgerschema.pre("findOneAndDelete",preventLedgermodification);
Ledgerschema.pre("deleteMany",preventLedgermodification);
Ledgerschema.pre("deleteOne",preventLedgermodification);

const Ledgermodel=mongoose.model("Ledger",Ledgerschema);
module.exports=Ledgermodel;