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
const {Server}=require("socket.io");

const server=http.createServer(app);
const io=new Server(server)


require("./models/message");
require("./models/user");
require("./models/relation");

const messageRouter=require("./routes/messageRouter");
const userRouter=require("./routes/userRouter");


app.use(cors());
app.use(express.json());

app.use("/user",userRouter);
app.use("/message",messageRouter);


io.on("connection",(socket)=>{
    console.log("User connected:",socket.id);  //connection ready
    socket.on("chat-message",(message)=>{
        console.log("user with id:",socket.id,"sent message:",message);   //message received from client
        io.emit("chat-message",message);    //broadcasting message to all clients including sender
        

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
