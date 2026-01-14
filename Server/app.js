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

const socketStore = require("./utils/socketInstance");




require("./models/message");
require("./models/user");
require("./models/relation");
require("./models/group");

const messageRouter=require("./routes/messageRouter");
const userRouter=require("./routes/userRouter");
const chatRouter=require("./routes/chatListRouter");
const mediaRouter = require("./routes/mediaRouter");
const geminiRouter = require("./routes/geminiRouter");




app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "../Client")));

socketIO(server);
app.use((req, res, next) => {
    req.io = socketStore.getIO();
    next();
  });
app.use("/user",userRouter);
app.use("/message",messageRouter);
app.use("/chat",chatRouter);
app.use("/media", mediaRouter);
app.use("/", geminiRouter);

app.get("/", (req, res) => {
    res.redirect("/user/main.html");
  });

db.sync({force:false}).then(()=>{
    console.log('Database synced successfully.');
    server.listen(process.env.PORT,()=>{
        console.log(`Server is running on port ${process.env.PORT}`);
    });
}).catch((err)=>{
    console.error('Error syncing database:',err);
});
