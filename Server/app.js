const express=require("express");
require("dotenv").config();
const app=express();
const cors=require('cors');
const mysql=require('mysql2');
const db=require("./utils/db-connection");
const fs=require("fs");
const morgan=require("morgan");
const path=require("path");

require("./models/message");
require("./models/user");
require("./models/relation");

const messageRouter=require("./routes/messageRouter");
const userRouter=require("./routes/userRouter");

app.use(cors());
app.use(express.json());

app.use("/user",userRouter);
app.use("/message",messageRouter);





db.sync({force:false}).then(()=>{
    console.log('Database synced successfully.');
    app.listen(process.env.PORT,()=>{
        console.log(`Server is running on port ${process.env.PORT}`);
    });
}).catch((err)=>{
    console.error('Error syncing database:',err);
});
