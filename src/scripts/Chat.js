document.addEventListener('DOMContentLoaded', () => {
  const chatForm = document.getElementById('chat-form');
  const chatInput = document.getElementById('chat-input');
  const chatBox = document.getElementById('chat-box');
  const sendButton = document.getElementById('send-button');
  const sendIcon = document.getElementById('send-icon');
  const loadingSpinner = document.getElementById('loading-spinner');

  if (!chatForm) return;

  chatForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const message = chatInput.value.trim();
    if (!message) return;

    chatInput.disabled = true;
    sendButton.disabled = true;
    sendIcon.classList.add('hidden');
    loadingSpinner.classList.remove('hidden');

    const userMessageDiv = document.createElement('div');
    userMessageDiv.className = 'flex justify-end mb-4';
    userMessageDiv.innerHTML = `<div class="bg-violet-700 dark:bg-blue-800 text-white rounded-lg p-3 max-w-xs"><p>${message}</p></div>`;
    chatBox.appendChild(userMessageDiv);
    chatBox.scrollTop = chatBox.scrollHeight;
    chatInput.value = '';

    try {
      const response = await fetch('/chat.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message }),
      });

      const data = await response.json();
      
      const aiMessageDiv = document.createElement('div');
      aiMessageDiv.className = 'flex justify-start mb-4';
      aiMessageDiv.innerHTML = `<div class="bg-gray-800 dark:bg-gray-600 text-white rounded-lg p-3 max-w-xs"><p>${data.reply || data.error}</p></div>`;
      chatBox.appendChild(aiMessageDiv);
      chatBox.scrollTop = chatBox.scrollHeight;

    } catch (error) {
      console.error('Error:', error);
    } finally {
      chatInput.disabled = false;
      sendButton.disabled = false;
      sendIcon.classList.remove('hidden');
      loadingSpinner.classList.add('hidden');
      chatInput.focus();
    }
  });
});