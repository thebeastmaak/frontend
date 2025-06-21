document.getElementById('askBtn').addEventListener('click', async () => {
  const question = document.getElementById('questionInput').value.trim();
  if (!question) return alert('Please enter a question.');

  const answerElem = document.getElementById('answerText');
  answerElem.textContent = 'Loading...';

  try {
    // Use full backend URL if hosted remotely, e.g.:
    // const backendUrl = 'https://backend-88jt.onrender.com/ask';
    // For local or proxy, '/ask' is fine.
    const res = await fetch('/ask', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ question }),
    });

    if (!res.ok) throw new Error(`Server error: ${res.status}`);

    const data = await res.json();
    answerElem.textContent = data.answer || 'No answer returned.';
  } catch (err) {
    console.error('Error:', err);
    answerElem.textContent = 'Error getting response.';
  }
});

// Voice recognition with feature detection
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
