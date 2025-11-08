const backendUrl="http://localhost:4000"

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