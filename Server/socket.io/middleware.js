const User=require("../models/user");
const jwt=require("jsonwebtoken");

module.exports=(io)=>{
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

})
};