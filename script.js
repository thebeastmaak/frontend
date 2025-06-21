const chatBox = document.getElementById("chat-box");
const userInput = document.getElementById("user-input");

// Your backend base URL (change this to your Render backend)
const BACKEND_URL = "https://backend-88jt.onrender.com";

function appendMessage(text, sender) {
  const message = document.createElement("div");
  message.className = `message ${sender}`;
  message.innerText = text;
  chatBox.appendChild(message);
  chatBox.scrollTop = chatBox.scrollHeight;

  if (sender === "bot") {
    speakText(text);
  }
}

async function sendMessage() {
  const question = userInput.value.trim();
  if (!question) return;

  appendMessage(question, "user");
  userInput.value = "";

  try {
    const res = await fetch(`${BACKEND_URL}/ask`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ question }),
    });
    const data = await res.json();
    appendMessage(data.answer, "bot");
  } catch (error) {
    appendMessage("Error getting response.", "bot");
    console.error(error);
  }
}

// Voice Input
function startVoice() {
  const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
  recognition.lang = "en-US";
  recognition.interimResults = false;

  recognition.onresult = (event) => {
    const transcript = event.results[0][0].transcript;
    userInput.value = transcript;
    sendMessage();
  };

  recognition.onerror = (event) => {
    console.error("Speech recognition error:", event.error);
  };

  recognition.start();
}

// Voice Output
function speakText(text) {
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = "en-US";
  speechSynthesis.speak(utterance);
}

// Enter key sends message
userInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") sendMessage();
});
