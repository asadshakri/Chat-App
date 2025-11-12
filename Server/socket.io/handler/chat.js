
module.exports=(io,socket)=>{
    socket.on("chat-message",(message)=>{
        console.log("user:",socket.user.name," sent message:",message);
        socket.broadcast.emit("chat-message",{
            message:message,
            name:socket.user.name,
        });


    })}