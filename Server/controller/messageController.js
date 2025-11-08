require("dotenv").config();
const messages=require("../models/message");
const users=require("../models/user");

const addMessage=async(req,res)=>{
    try{
        const message=req.body.message;
        const UserId=req.user.id;
    
        await messages.create({
            message,
            UserId
        })
        res.status(201).json({message:"Message added successfully"});

    }
    catch(err)
    {
        console.log("Error in adding message")
        res.status(500).json({message:err.message});
    }
}

module.exports={addMessage};