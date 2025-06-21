const chatBox = document.getElementById("chat-box");
const userInput = document.getElementById("user-input");
const pdfInput = document.getElementById("pdf");

// Your backend base URL (change this to your Render-hosted API)
const BACKEND_URL = "https://your-render-backend.onrender.com";

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

async function uploadPdf() {
  const file = pdfInput.files[0];
  if (!file) {
    alert("Please select a PDF file.");
    return;
  }

  const formData = new FormData();
  formData.append("pdf", file);

  try {
    const res = await fetch(`${BACKEND_URL}/upload-pdf`, {
      method: "POST",
      body: formData,
    });
    const data = await res.json();
    alert(data.message || "PDF uploaded successfully!");
  } catch (error) {
    alert("Failed to upload PDF.");
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

// Enter key to send
userInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") sendMessage();
});
