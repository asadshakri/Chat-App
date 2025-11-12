const express=require("express");
require("dotenv").config();
const app=express();
const cors=require('cors');
const mysql=require('mysql2');
const http=require("http");
const db=require("./utils/db-connection");
const fs=require("fs");
const morgan=require("morgan");
const path=require("path");
const jwt=require("jsonwebtoken");
const {Server}=require("socket.io");

const server=http.createServer(app);
const io=new Server(server,{
    cors:{
        origin:"*",
        methods:["GET","POST"]
    }
})


require("./models/message");
const User=require("./models/user");
require("./models/relation");

const messageRouter=require("./routes/messageRouter");
const userRouter=require("./routes/userRouter");


app.use(cors());
app.use(express.json());

app.use("/user",userRouter);
app.use("/message",messageRouter);

io.use(async(socket,next)=>{

    try{
    const token=socket.handshake.auth.token;

    if(!token){
        return next(new Error("Authentication error: Token not provided"));
    }
        
       const user=jwt.verify(token,`${process.env.TOKEN}`);

        if(!user){
            return next(new Error("Authentication error: Invalid token"));
        }

        const sendingUser=await User.findByPk(user.userId);
          
        if(!sendingUser){
            return next(new Error("Authentication error: User not found"));
        }
        socket.user=sendingUser;
        next();
    }
    catch(err)
    {
        return next(new Error("Authentication error: "+err.message));
    }      

});

io.on("connection",(socket)=>{
    console.log("User connected:",socket.id);  //connection ready
    socket.on("chat-message",(message)=>{
        console.log("user:",socket.user.name," sent message:",message);
        socket.broadcast.emit("chat-message",{
            message:message,
            name:socket.user.name,
        });


    })

})


db.sync({force:false}).then(()=>{
    console.log('Database synced successfully.');
    server.listen(process.env.PORT,()=>{
        console.log(`Server is running on port ${process.env.PORT}`);
    });
}).catch((err)=>{
    console.error('Error syncing database:',err);
});
