const backendUrl="http://localhost:4000"
const socket=io(backendUrl);
const chatBody = document.getElementById("chatBody");
const input = document.getElementById("messageInput");
const sendBtn = document.getElementById("sendBtn");

sendBtn.addEventListener("click", sendMessage);
input.addEventListener("keypress", (e) => {
  if (e.key === "Enter") 
    sendMessage();
});

async function sendMessage() {

 try{
  const text = input.value.trim();
  if (!text) return;

  const token=localStorage.getItem("token");
  const addedMessage= await axios.post(`${backendUrl}/message/add`, {message:text}, {
    headers: {
      'Authorization': token
    }
  });


  const msgDiv = document.createElement("div");
  msgDiv.classList.add("message", "sent", "shadow-sm");
  msgDiv.innerHTML = `
    ${text}
    <div class="timestamp">${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
  `;
  chatBody.appendChild(msgDiv);
  input.value = "";
  chatBody.scrollTop = chatBody.scrollHeight;

 }
  catch(err){
    console.log("Error in sending message:", err);
    return;
}
}

window.addEventListener("DOMContentLoaded", fetchMessages);

async function fetchMessages() {
    try{
    const token=localStorage.getItem("token");
    const response=await axios.get(`${backendUrl}/message/get`)
    const messages=response.data.messages;
    const decoded = JSON.parse(atob(token.split(".")[1]));
    const currentUserId = decoded.userId;
    chatBody.innerHTML="";
    messages.forEach(msg => {
        if(msg.UserId===currentUserId){
        const msgDiv = document.createElement("div");
        msgDiv.classList.add("message", "sent", "shadow-sm");
        msgDiv.innerHTML = `
          ${msg.message}
          <div class="timestamp">${new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
        `;
        chatBody.appendChild(msgDiv);
        }
      else
      {
        const msgDiv = document.createElement("div");
        msgDiv.classList.add("message", "received", "shadow-sm");
        msgDiv.innerHTML = `
          <strong>${msg.User.name}</strong> ${msg.message}
          <div class="timestamp">${new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
        `;
        chatBody.appendChild(msgDiv);
    }
});
    chatBody.scrollTop = chatBody.scrollHeight;
    }
    catch(err){
        console.log("Error in fetching messages:", err);
        return;
    }
}

function logout(){
    localStorage.removeItem("token");
    window.location.href="../user/main.html";
}