const backendUrl = 'https://backend-88jt.onrender.com'; // ✅ your Render backend URL

document.getElementById('askBtn').addEventListener('click', async () => {
  const question = document.getElementById('questionInput').value.trim();
  const answerText = document.getElementById('answerText');

  if (!question) {
    alert('Please enter a question.');
    return;
  }

  answerText.textContent = 'Loading...';

  try {
    const res = await fetch(`${backendUrl}/ask`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ question }),
    });

    if (!res.ok) {
      const errText = await res.text();
      throw new Error(`Server Error: ${res.status} - ${errText}`);
    }

    const data = await res.json();
    answerText.textContent = data.answer || 'No answer returned.';
  } catch (error) {
    console.error('Fetch error:', error);
    answerText.textContent = 'Error getting response.';
  }
});

// 🎤 Voice recognition
document.getElementById('voiceBtn').addEventListener('click', () => {
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SpeechRecognition) {
    alert('Sorry, your browser does not support Speech Recognition.');
    return;
  }

  const recognition = new SpeechRecognition();
  recognition.lang = 'en-US';
  recognition.start();

  recognition.onresult = event => {
    const speechText = event.results[0][0].transcript;
    document.getElementById('questionInput').value = speechText;
  };

  recognition.onerror = event => {
    alert('Speech recognition error: ' + event.error);
  };
});

// 🔊 Voice read answer
document.getElementById('listenBtn').addEventListener('click', () => {
  const answerText = document.getElementById('answerText').textContent;
  if (!answerText || answerText === 'Your answer will appear here...' || answerText === 'Loading...') {
    alert('No answer to read.');
    return;
  }

  // Cancel any ongoing speech synthesis
  window.speechSynthesis.cancel();

  const utterance = new SpeechSynthesisUtterance(answerText);
  utterance.lang = 'en-US';
  utterance.rate = 1;
  utterance.pitch = 1;

  window.speechSynthesis.speak(utterance);
});
