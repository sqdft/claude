const input = document.getElementById("input");
const sendBtn = document.getElementById("send");
const chat = document.getElementById("chat");

function addMessage(content, sender) {
  const msg = document.createElement("div");
  msg.className = `message ${sender}`;
  msg.textContent = content;
  chat.appendChild(msg);
  chat.scrollTop = chat.scrollHeight;
}

function addLoader() {
  const loader = document.createElement("div");
  loader.className = "message assistant";
  loader.id = "loading";
  loader.innerHTML = "Typing<span class='loader'>...</span>";
  chat.appendChild(loader);
  chat.scrollTop = chat.scrollHeight;
}

function removeLoader() {
  const loader = document.getElementById("loading");
  if (loader) loader.remove();
}

sendBtn.addEventListener("click", async () => {
  const text = input.value.trim();
  if (!text) return;

  addMessage(text, "user");
  input.value = "";
  input.focus();

  sendBtn.disabled = true;
  addLoader();

  try {
    const res = await fetch("/api/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ message: text })
    });

    const data = await res.json();
    removeLoader();

    if (data?.response) {
      addMessage(data.response, "assistant");
    } else {
      addMessage("⚠️ No response from assistant.", "assistant");
    }
  } catch (e) {
    removeLoader();
    addMessage("❌ Error: " + e.message, "assistant");
  } finally {
    sendBtn.disabled = false;
  }
});

// Enter key sends message
input.addEventListener("keydown", (e) => {
  if (e.key === "Enter" && !e.shiftKey) {
    e.preventDefault();
    sendBtn.click();
  }
});
