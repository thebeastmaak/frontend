const backendUrl = 'https://backend-88jt.onrender.com'; // ✅ Replace with your actual Render backend URL

document.getElementById('askBtn').addEventListener('click', async () => {
  const question = document.getElementById('questionInput').value.trim();
  const pdfFile = document.getElementById('pdfInput').files[0];
  const answerText = document.getElementById('answerText');

  if (!question || !pdfFile) {
    alert('Please enter a question and upload a PDF file.');
    return;
  }

  answerText.textContent = 'Loading...';

  const formData = new FormData();
  formData.append('question', question);
  formData.append('pdf', pdfFile);

  try {
    const res = await fetch(`${backendUrl}/ask`, {
      method: 'POST',
      body: formData,
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
