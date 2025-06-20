const chatbox = document.getElementById("chatbox");
const questionInput = document.getElementById("question");

function appendMessage(sender, text) {
  chatbox.innerHTML += `<p><strong>${sender}:</strong> ${text}</p>`;
  chatbox.scrollTop = chatbox.scrollHeight;
}

async function askQuestion() {
  const question = questionInput.value.trim();
  if (!question) return;

  appendMessage("You", question);
  questionInput.value = "";

  const res = await fetch("https://backend-epjf.onrender.com/ask", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ question }),
  });

  const data = await res.json();
  appendMessage("Bot", data.answer);
  speak(data.answer);
}

document.getElementById("askBtn").onclick = askQuestion;

function speak(text) {
  const utterance = new SpeechSynthesisUtterance(text);
  speechSynthesis.speak(utterance);
}

const recognition = new webkitSpeechRecognition();
recognition.continuous = false;
recognition.interimResults = false;
recognition.lang = "en-US";

document.getElementById("voiceBtn").onclick = () => {
  recognition.start();
};

recognition.onresult = (event) => {
  const transcript = event.results[0][0].transcript;
  questionInput.value = transcript;
  askQuestion();
};
