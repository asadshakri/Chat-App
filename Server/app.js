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

const socketIO=require("./socket.io");
const server=http.createServer(app);



require("./models/message");
require("./models/user");
require("./models/relation");
require("./models/group");

const messageRouter=require("./routes/messageRouter");
const userRouter=require("./routes/userRouter");
const chatRouter=require("./routes/chatListRouter");


app.use(cors());
app.use(express.json());

socketIO(server);

app.use("/user",userRouter);
app.use("/message",messageRouter);
app.use("/chat",chatRouter);



db.sync({force:false}).then(()=>{
    console.log('Database synced successfully.');
    server.listen(process.env.PORT,()=>{
        console.log(`Server is running on port ${process.env.PORT}`);
    });
}).catch((err)=>{
    console.error('Error syncing database:',err);
});
