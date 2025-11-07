const users=require("../models/user")
const bcrypt=require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const { Op } = require("sequelize");


const addUsers= async(req,res)=>{
    try{
    const {name,email,phone,password,}=req.body;

    const existingUser = await users.findOne({
        where: {
          [Op.or]: [
            { email: email },
            { phone: phone }
          ]
        }
      });
      
      if (existingUser) {
        return res.status(409).json({ message: "User already registered" });
      }
    
    const saltrounds=10;
    bcrypt.hash(password,saltrounds,async(err,hash)=>{
        if(err)
        console.log(err);

        await users.create({name,email,phone,password:hash});
        console.log("User successfully added");
        res.status(201).json({message:"user added successfully"});
    })
    
    }
    catch(err)
    {
        console.log("Error in adding user")
        res.status(500).json({message:err.message});
    }

};


function generateToken(id)
{
    return jwt.sign({userId:id},process.env.TOKEN);
}
const loginUser=async(req,res)=>{
    try{
        const {emailOrPhone,password}=req.body;
        const existingUser = await users.findOne({
            where: {
              [Op.or]: [
                { email: emailOrPhone },
                { phone: emailOrPhone }
              ]
            }
          });
        if(!existingUser)
        {
            res.status(404).json({message:"User not found! Create an account"});
            return;
        }
        bcrypt.compare(password,existingUser.password,(err,result)=>{
            if(err)
            {
                throw new Error("Something went wrong")
            }
            if(result==true){
               res.status(200).json({message:"User login successful",token:generateToken(existingUser.id)});
               return;
            }
            else
            {
                res.status(401).json({message:"User not authorized! Password incorrect"});
                return;
            }
        })
           
        }
    catch(err)
    {
        res.status(500).json({message:err.message});
    }
}


module.exports={
    addUsers,
    loginUser
}