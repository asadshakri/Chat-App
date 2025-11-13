const {Server}=require("socket.io");
const socketMiddleware=require("./middleware");
const socketHandler=require("./handler/chat");
const personalHandler=require("./handler/personalChat");
module.exports=(server)=>{
    const io=new Server(server,{
        cors:{
            origin:"*"
        }
    })

    socketMiddleware(io);

    io.on("connection",(socket)=>{
    console.log("User connected:",socket.id);  //connection ready
    socketHandler(io,socket);
    personalHandler(io,socket);

})

    return io;

}


