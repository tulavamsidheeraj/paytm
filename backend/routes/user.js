const express=require("express")
const zod=require("zod");
const { User, Account } = require("../db");
const {authMiddleware}=require("../middleware")
const jwt=require("jsonwebtoken")
const JWT_SECRET=require("../config")
const userRouter=express.Router();


const signupSchema=zod.object({
    username:zod.string().email(),
    password:zod.string(),
    firstName:zod.string(),
    lastName:zod.string(),
})
userRouter.post("/signup",async (req,res)=>{
    const body=req.body;
    const {success}=signupSchema.safeParse(req.body);
    if (!success){
        return res.json({msg:"Email already taken"})
    }
    const existingUser=User.findOne({
        username:body.username
    })
    if(existingUser){
        return res.json({msg:"Email already taken"})
    }
    const user=await User.create({
        username:req.body.username,
        password:req.body.password,
        firstName:req.body.firstName,
        lastName:req.body.lastName
    })
    const userId=user._id;
    await Account.create({
        userId,
        balance:1+Math.random()*10000,
    })
    
    const token=jwt.sign({
        userId
    },JWT_SECRET);
    res.json({
        msg:"User created successfully",
        token:token
    })
})

const signInSchema=zod.object({
    username:zod.string().email(),
    password:zod.string()
})
userRouter.post("/signin",authMiddleware, async(req,res)=>{
    const body=req.body();
    const {success}=signInSchema.safeParse(body);
    if(!success){
        return res.json({msg:"Wrong username or password"});
    }
    const user=await User.findOne({
        username:req.body.username,
        password:req.body.password
    });
    if(user){
        const token=jwt.sign({
            userId:user._id
        },JWT_SECRET);
        res.json({
            token:token
        })
        return;
    }
    res.status(413).json({
        msg:"Error while logging in"
    })

})


const updateBodySchema=zod.object({
    password:zod.string().optional(),
    firstName:zod.string().optional(),
    lastName:zod.string().optional()
})
userRouter.put("/",authMiddleware,async (req,res)=>{
    const {success}=zod.safeParse(req.body);
    if (!success){
        res.status(411).json({})
    }
    await User.updateOne(req.body,{
        id:_userId
    })
    res.json({msg:"Update done!!"})
})



userRouter.get("/bulk",async(req,res)=>{
    const filter=req.query.filter||"";
    const users=await User.find({
        $or:[{
            firstName:{"$regex":filter}},
            {
            lastName:{"$regex":filter}}
        ]
    })
    res.json({
        user:users.map(user=>[{
            username:user.username,
            firstName:user.firstName,
            lastName:user.lastName,
            id:user._id
        }])
    })
})



module.exports=userRouter;