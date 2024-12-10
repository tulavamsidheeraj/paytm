const express=require("express");
const { authMiddleware } = require("../middleware");
const { Account } = require("../db");
const { default: mongoose } = require("mongoose");

const accountRouter=express.Router();



accountRouter.get("/balance",authMiddleware, async(req,res)=>{
    
    const account=await Account.findOne({
        userId:req.userId
    });
    res.status(200).json({
        balance:account.balance,
    })
})


accountRouter.post("/transfer",authMiddleware,async(req,res)=>{
    const session=await mongoose.startSession();
    
    //from startTransaction to commitTransaction all happens or nothing happens 
    session.startTransaction();

    const {amount,to}=req.body;


    const account=await Account.findOne({
        userId:req.userId
    });
    if(!account || account.balance<amount){
        return res.status(400).json({
            msg:"Insufficient balance"
        })
    }


    const toAccount=await Account.findOne({
        userId:to,
    })
    
    if(!toAccount){
        return res.status(400).json({
            msg:"Invalid Account"
        })
    }
    
    await Account.updateOne({userId:req.userId},{$inc:{balance:-amount}}).session(session);
    await Account.updateOne({userId:to},{$inc:{balance:amount}}).session(session);
    
    await session.commitTransaction();
    
    res.json({
        msg:"Transfer successful"
    })
});


module.exports=accountRouter;