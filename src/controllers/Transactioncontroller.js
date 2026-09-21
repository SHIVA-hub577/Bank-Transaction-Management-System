const accountmodel=require("../models/Accountmodel");
const transactionmodel=require("../models/Transactionmodel");
const Ledgermodel=require("../models/Ledgermodel");

exports.createtransaction=async (req,res,next)=>{
 const{fromaccount,toaccount,amount,idempotencykey}=req.body;

 if(!fromaccount || !toaccount || !amount || !idempotencykey){
    return res.status(401).json({
        message:"All Details are required"
    })
 }

 const isfromaccount=await accountmodel.findById({_id:fromaccount});
 const istoaccount=await accountmodel.findById({_id:toaccount});

 if(!isfromaccount || !istoaccount){
    return res.status(402).json({
        message:"Invalid Account details"
    })
 }

 const istransactionexists=await transactionmodel.findOne({idempotencykey});
 if(istransactionexists){
    if(istransactionexists.status=="COMPLETED"){
        return res.status(200).json({
            message:"Transaction Already completed"
        })
    }
    if(istransactionexists.status=="FAILED"){
        return res.status(200).json({
            message:"Transaction Failed Cannot retry"
        })
    }
    if(istransactionexists.status=="REVERSED"){
        return res.status(200).json({
            message:"Transaction Reversed Cannot retry"
        })
    }

    if(istransactionexists.status=="PENDING"){
        return res.status(200).json({
            message:"Transaction Already exists,in Pending state",
            
        })
    }
 }
    
}