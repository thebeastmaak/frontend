document.getElementById('askBtn').addEventListener('click', async () => {
  const question = document.getElementById('questionInput').value.trim();
  if (!question) return alert('Please enter a question.');

  document.getElementById('answerText').textContent = 'Loading...';

  try {
    const res = await fetch('https://backend-88jt.onrender.com/ask', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ question })
    });

    if (!res.ok) throw new Error('Network response was not ok');

    const data = await res.json();
    document.getElementById('answerText').textContent = data.answer || 'No answer returned.';
  } catch (err) {
    console.error('Error:', err);
    document.getElementById('answerText').textContent = 'Error getting response.';
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
