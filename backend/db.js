const mongoose= require('mongoose');
mongoose.connect("mongodb+srv://tulavamsidheeraj:Dheeraj@45@cluster.6ydfm.mongodb.net/")
const UserSchema=new mongoose.Schema({
    firstName:{
        type:String,
        required:true
    },
    lastName:{
        type:String,
        required:true
    },
    username:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    }
});


const accountSchema=new mongoose.Schema({
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        requires:true
    },
    balance:{
        type:Number,
        required:true
    }
});



const User = new mongoose.model("User", UserSchema)
const Account=new mongoose.model("Account",accountSchema)

module.exports={
    User,
    Account
}