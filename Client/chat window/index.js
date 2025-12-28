const backendUrl="http://localhost:4000"
const chatBody = document.getElementById("chatBody");
const input = document.getElementById("messageInput");
const sendBtn = document.getElementById("sendBtn");
const token=localStorage.getItem("token");
const socket = io(backendUrl, {
  auth: { token }
});

const roombtn=document.getElementById("roomBtn");
roombtn.addEventListener("click",async()=>{
  try{
  const myEmail=localStorage.getItem("email");
  const roomNameEmail=document.getElementById("roomEnter").value;
  chatBody.innerHTML="";

  const response=await axios.post(`${backendUrl}/user/checkEmail`,{email:roomNameEmail});
    if(response.data.exists===false){

      alert("The email you entered does not exist. Please enter a valid email to join a room.");
      return;
    }
  const roomName=[myEmail,roomNameEmail].sort().join("-");
  if(roomName.trim()===""){
    alert("Please enter a valid room name");
    return;
  }
  socket.emit("join-room",roomName);
  window.roomName=roomName;
  alert(`Joined room: ${roomName}`);
  localStorage.setItem("roomName",roomName);
  document.getElementById("pName").textContent=`Chatting with: ${roomNameEmail}`;
  document.getElementById("roomEnter").value="";
  localStorage.setItem("chatWith", roomNameEmail);
  fetchMessages();
}
  catch(err){
    console.log("Error in joining room:",err);
    return;
  }
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

socket.on("new-G-message", (data) => {
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
  if (!text || !window.roomName)
  { 
     return;
  }

  const token=localStorage.getItem("token");
  const addedMessage= await axios.post(`${backendUrl}/message/add`, {message:text,roomName:window.roomName}, {
    headers: {
      'Authorization': token
    }
  });

  socket.emit("new-message", { message: text, roomName: window.roomName });

  sentMessage({ message: text, createdAt: new Date() });
  
  input.value = "";
  chatBody.scrollTop = chatBody.scrollHeight;

 }
  catch(err){
    console.log("Error in sending message:", err);
    return;
}
}

window.addEventListener("DOMContentLoaded", ()=>{
  const chatWith=localStorage.getItem("chatWith");
  if(chatWith){
    document.getElementById("pName").textContent=`Chatting with: ${chatWith}`;
  fetchMessages();
  }
  loadChatList();

}

);

async function fetchMessages() {
  try {

    const roomName=localStorage.getItem("roomName");

    if(!roomName){
      return;
    }
    window.roomName=roomName;
    const token = localStorage.getItem("token");

    socket.emit("join-room", roomName);

    const response = await axios.post(`${backendUrl}/message/get`, {
      roomName
    });

    const messages = response.data.messages;

    const decoded = JSON.parse(atob(token.split(".")[1]));
    const currentUserId = decoded.userId;

    chatBody.innerHTML = "";

    messages.forEach(msg => {
      if (msg.UserId === currentUserId)
        sentMessage(msg);
      else
        receivedMessage(msg);
    });

    chatBody.scrollTop = chatBody.scrollHeight;

  } catch (err) {
    console.log("Error in fetching messages:", err);
  }
}

function sentMessage(msg){
  const msgDiv = document.createElement("div");
  msgDiv.classList.add("message", "sent", "shadow-sm");
  msgDiv.innerHTML = `
    ${msg.message}
    <div class="timestamp">
  ${new Date(msg.createdAt).toLocaleString([], {
    year: 'numeric',
    month: 'short',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  })}
</div>
  `;
  chatBody.appendChild(msgDiv);
}

function receivedMessage(msg){
  const msgDiv = document.createElement("div");
  msgDiv.classList.add("message", "received", "shadow-sm");
  msgDiv.innerHTML = `
    <strong>${msg.User.name}</strong> ${msg.message}
    <div class="timestamp">
  ${new Date(msg.createdAt).toLocaleString([], {
    year: 'numeric',
    month: 'short',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  })}
</div>
  `;
  chatBody.appendChild(msgDiv);
}

function logout(){
    localStorage.removeItem("token");
    localStorage.removeItem("email");
    localStorage.removeItem("roomName");
    localStorage.removeItem("chatWith");
    window.location.href="../user/main.html";
}

function createGroup(){
    const popUpDiv=document.createElement("div");
    popUpDiv.classList.add("popup");
    popUpDiv.innerHTML=`<div class="popup-content">
    <span class="close-btn" id="closeBtn">&times;</span>
    <h3>Create Group</h3>
    <br>
    <input type="text" class="form-control" id="groupNameInput" placeholder="Enter group name" />
    <br>
    <button type="button" class="btn btn-light" id="createGroupBtn">Create</button>
  </div>`;

    document.body.appendChild(popUpDiv);

    const closeBtn=document.getElementById("closeBtn");
    closeBtn.addEventListener("click",()=>{
        document.body.removeChild(popUpDiv);
    });

    const createGroupBtn=document.getElementById("createGroupBtn");
    createGroupBtn.addEventListener("click",async()=>{
        const groupName=document.getElementById("groupNameInput").value.trim();
        if(groupName===""){
            alert("Please enter a valid group name");
            return;
        }
        try{
            const response=await axios.post(`${backendUrl}/user/createGroup`,{Gname:groupName},{
                headers:{
                    'Authorization':localStorage.getItem("token")
                }
            });
            alert(`Group "${response.data.Gname}" created successfully!`);
    
            document.body.removeChild(popUpDiv);
            const myEmail=localStorage.getItem("email");
          const roomName=response.data.uuid;
          chatBody.innerHTML="";
          socket.emit("join-G-room",roomName);
  window.roomName=roomName;
  localStorage.setItem("roomName",roomName);
  document.getElementById("pName").textContent=`Chatting with: ${response.data.Gname}`;
  //document.getElementById("roomEnter").value="";
  localStorage.setItem("chatWith", roomName);
  fetchMessages();

const ul = document.getElementById("chatListUI");
const li = document.createElement("li");
li.className = "list-group-item list-group-item-action";
li.textContent = `👥 ${response.data.Gname}`;
li.onclick = () => joinExistingGroup({uuid: response.data.uuid, name: response.data.Gname});
ul.appendChild(li);


   
        }
        catch(err){
            console.log("Error in creating group:",err);
            alert("Failed to create group. Please try again.");
        }
    });

}

function joinGroup(){
    const popUpDiv=document.createElement("div");
    popUpDiv.classList.add("popup");
    popUpDiv.innerHTML=`<div class="popup-content">
    <span class="close-btn" id="closeBtn">&times;</span>
    <h3>Join Group</h3>
    <br>
    <input type="text" class="form-control" id="groupIdInput" placeholder="Enter group ID" />
    <br>
    <button type="button" class="btn btn-light" id="joinGroupBtn">Join</button>
  </div>`;

    document.body.appendChild(popUpDiv);

    const closeBtn=document.getElementById("closeBtn");
    closeBtn.addEventListener("click",()=>{
        document.body.removeChild(popUpDiv);
    });

    const joinGroupBtn=document.getElementById("joinGroupBtn");
    joinGroupBtn.addEventListener("click",async()=>{
        const groupId=document.getElementById("groupIdInput").value.trim();
        if(groupId===""){
            alert("Please enter a valid group ID");
            return;
        }
        try{
            const response=await axios.post(`${backendUrl}/user/joinGroup`,{Guuid:groupId},{
                headers:{
                    'Authorization':localStorage.getItem("token")
                }
            });
            alert(`Joined group "${response.data.Gname}" successfully!`);
            document.body.removeChild(popUpDiv);
            const myEmail=localStorage.getItem("email");
            const roomName=response.data.uuid;
            chatBody.innerHTML="";
            socket.emit("join-G-room",roomName);
    window.roomName=roomName;
    localStorage.setItem("roomName",roomName);
    document.getElementById("pName").textContent=`Chatting with: ${response.data.Gname}`;
    //document.getElementById("roomEnter").value="";
    localStorage.setItem("chatWith", roomName);
    fetchMessages();
    const ul = document.getElementById("chatListUI");
const li = document.createElement("li");
li.className = "list-group-item list-group-item-action";
li.textContent = `👥 ${response.data.Gname}`;
li.onclick = () => joinExistingGroup({uuid: response.data.uuid, name: response.data.Gname});
ul.appendChild(li);

        }
        catch(err){
            console.log("Error in joining group:",err);
            alert("Failed to join group. Please try again.");
        }
    });
}

let list;

async function loadChatList() {
  try {
    const token = localStorage.getItem("token");

    const response = await axios.get(`${backendUrl}/chat/list`, {
      headers: { Authorization: token }
    });

    list = response.data.chatList;
    const ul = document.getElementById("chatListUI");
    ul.innerHTML = "";

    list.forEach(chat => {
      const li = document.createElement("li");
      li.className = "list-group-item list-group-item-action";

    
      if (chat.type === "user") {
        li.textContent = chat.email;
        li.onclick = () => joinExistingChat(chat.email);
      }

     
      if (chat.type === "group") {
        li.textContent = `👥 ${chat.name}`;
        li.onclick = () => joinExistingGroup(chat);
      }

      ul.appendChild(li);
    });

  } catch (err) {
    console.log("Error loading chat list:", err);
  }
}

function joinExistingChat(friends_email){
  localStorage.setItem("chatWith", friends_email);
  const myEmail=localStorage.getItem("email");
  const roomName=[myEmail,friends_email].sort().join("-");
  chatBody.innerHTML="";
  socket.emit("join-room",roomName);
  window.roomName=roomName;
  localStorage.setItem("roomName",roomName);
  document.getElementById("pName").textContent=`Chatting with: ${friends_email}`;
  fetchMessages();
}

function joinExistingGroup(group) {
  chatBody.innerHTML = "";

  socket.emit("join-G-room", group.uuid);

  window.roomName = group.uuid;
  localStorage.setItem("roomName", group.uuid);
  localStorage.setItem("chatWith", group.name);

  document.getElementById("pName").textContent =
    `Chatting with: ${group.name}`;

  fetchMessages();
}