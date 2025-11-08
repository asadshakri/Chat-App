const chatBody = document.getElementById("chatBody");
const input = document.getElementById("messageInput");
const sendBtn = document.getElementById("sendBtn");

sendBtn.addEventListener("click", sendMessage);
input.addEventListener("keypress", (e) => {
  if (e.key === "Enter") sendMessage();
});

function sendMessage() {
  const text = input.value.trim();
  if (!text) return;

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