module.exports=(io,socket)=>{


    socket.on("join-room",(roomName)=>{
        socket.join(roomName);
        console.log(`user: ${socket.user.name} joined room: ${roomName}`);
    })

    socket.on("new-message",({message,roomName})=>{
        console.log("user:",socket.user.name," sent message:",message);
        socket.to(roomName).emit("new-message",{
            message:message,
            name:socket.user.name,
        });

     /*   socket.broadcast.emit("new-message",{
            message:message,
            name:socket.user.name,
        });*/


    })}