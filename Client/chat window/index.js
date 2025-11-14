const backendUrl="http://localhost:4000"
const chatBody = document.getElementById("chatBody");
const input = document.getElementById("messageInput");
const sendBtn = document.getElementById("sendBtn");
const token=localStorage.getItem("token");
const socket = io(backendUrl, {
  auth: { token }
});

const roombtn=document.getElementById("roomBtn");
roombtn.addEventListener("click",()=>{
  const roomNameEmail=document.getElementById("roomEnter").value;
  if(roomNameEmail.trim()===""){
    alert("Please enter a valid room name");
    return;
  }
  socket.emit("join-room",roomNameEmail);
  window.roomNameEmail=roomNameEmail;
  alert(`Joined room: ${roomNameEmail}`);
});


socket.on("connect", () => {
  console.log("Connected to socket server:", socket.id);
});

/*socket.on("connect_error", (err) => {
  console.error("Socket connection failed:", err.message);
  alert("Authentication failed. Please log in again.");
  localStorage.removeItem("token");
  window.location.href = "../user/main.html";
});*/



socket.on("new-message", (data) => {
  if (!data) return;
  receivedMessage({
    message: data.message,
    User: { name: data.name },
    createdAt: new Date()
  });
  chatBody.scrollTop = chatBody.scrollHeight;
});

sendBtn.addEventListener("click", sendMessage);
input.addEventListener("keypress", (e) => {
  if (e.key === "Enter") 
    sendMessage();
});

async function sendMessage() {

 try{
  const text = input.value.trim();
  if (!text || !window.roomNameEmail)
  { 
     return;
  }

  const token=localStorage.getItem("token");
  const addedMessage= await axios.post(`${backendUrl}/message/add`, {message:text}, {
    headers: {
      'Authorization': token
    }
  });

  socket.emit("new-message", { message: text, roomName: window.roomNameEmail });

  sentMessage({ message: text, createdAt: new Date() });

  input.value = "";
  chatBody.scrollTop = chatBody.scrollHeight;

 }
  catch(err){
    console.log("Error in sending message:", err);
    return;
}
}

//window.addEventListener("DOMContentLoaded", fetchMessages);

async function fetchMessages() {
    try{
    const token=localStorage.getItem("token");
    const response=await axios.get(`${backendUrl}/message/get`)
    const messages=response.data.messages;
    const decoded = JSON.parse(atob(token.split(".")[1]));
    const currentUserId = decoded.userId;
    chatBody.innerHTML="";
    messages.forEach(msg => {
        if(msg.UserId===currentUserId)
          sentMessage(msg);
        else
          receivedMessage(msg);
});
    chatBody.scrollTop = chatBody.scrollHeight;
    }
    catch(err){
        console.log("Error in fetching messages:", err);
        return;
    }
}

function sentMessage(msg){
  const msgDiv = document.createElement("div");
  msgDiv.classList.add("message", "sent", "shadow-sm");
  msgDiv.innerHTML = `
    ${msg.message}
    <div class="timestamp">${new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
  `;
  chatBody.appendChild(msgDiv);
}

function receivedMessage(msg){
  const msgDiv = document.createElement("div");
  msgDiv.classList.add("message", "received", "shadow-sm");
  msgDiv.innerHTML = `
    <strong>${msg.User.name}</strong> ${msg.message}
    <div class="timestamp">${new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
  `;
  chatBody.appendChild(msgDiv);
}

function logout(){
    localStorage.removeItem("token");
    window.location.href="../user/main.html";
}