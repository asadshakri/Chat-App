
module.exports=(io,socket)=>{


    socket.on("join-G-room",(roomName)=>{
        socket.join(roomName);
        console.log(`user: ${socket.user.name} joined room: ${roomName}`);
    })

    socket.on("new-G-message",({message,roomName})=>{
        console.log("user:",socket.user.name," sent message:",message);
        socket.to(roomName).emit("new-G-message",{
            message:message,
            name:socket.user.name,
            email:socket.user.email,
        });

     /*   socket.broadcast.emit("new-message",{
            message:message,
            name:socket.user.name,
        });*/


    })}