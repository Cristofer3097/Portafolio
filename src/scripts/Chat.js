document.addEventListener('DOMContentLoaded', () => {
    const chatForm = document.getElementById('chat-form');
    const chatInput = document.getElementById('chat-input');
    const chatBox = document.getElementById('chat-box');
    const sendButton = document.getElementById('send-button');
    const sendIcon = document.getElementById('send-icon');
    const loadingSpinner = document.getElementById('loading-spinner');
    
    // Elementos de la Burbuja
    const chatBubble = document.getElementById('chat-bubble');
    const chatContainer = document.getElementById('chat-container');
    const closeChatBtn = document.getElementById('close-chat-btn');
    const chatNotification = document.getElementById('chat-notification');
    
    let isChatOpen = false;
    let unreadCount = 1; // Empieza en 1 por el mensaje de bienvenida
  
    if (!chatForm || !chatBubble) return;
  
    // Función para manejar las notificaciones visuales
    function updateNotification() {
      if (unreadCount > 0) {
          chatNotification.textContent = unreadCount;
          chatNotification.classList.remove('opacity-0');
      } else {
          chatNotification.classList.add('opacity-0');
      }
    }
  
    // Función para abrir/cerrar el chat con animaciones
    function toggleChat(e) {
      if(e) e.stopPropagation();
      isChatOpen = !isChatOpen;
      
      if (isChatOpen) {
          // Mostrar
          chatContainer.classList.remove('hidden');
          // Delay de 10ms para permitir que el navegador registre la eliminación del 'hidden' antes de animar
          setTimeout(() => {
              chatContainer.classList.remove('scale-0', 'opacity-0');
              chatContainer.classList.add('scale-100', 'opacity-100');
          }, 10);
          
          // Leer los mensajes
          unreadCount = 0;
          updateNotification();
          chatInput.focus();
      } else {
          // Ocultar
          chatContainer.classList.remove('scale-100', 'opacity-100');
          chatContainer.classList.add('scale-0', 'opacity-0');
          // Esperar que termine la animación antes de poner display: none
          setTimeout(() => {
              chatContainer.classList.add('hidden');
          }, 300); 
      }
    }
  
    chatBubble.addEventListener('click', toggleChat);
    closeChatBtn.addEventListener('click', toggleChat);

    document.addEventListener('click', (e) => {
        if (window.innerWidth < 640) {
            if (isChatOpen && !chatContainer.contains(e.target) && !chatBubble.contains(e.target)) {
                toggleChat(null); 
            }
        }
    });
  
    chatForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const message = chatInput.value.trim();
      if (!message) return;
  
      // Desactivar input y mostrar cargando
      chatInput.disabled = true;
      sendButton.disabled = true;
      sendIcon.classList.add('hidden');
      loadingSpinner.classList.remove('hidden');
  
      // Renderizar mensaje del usuario
      const userMessageDiv = document.createElement('div');
      userMessageDiv.className = 'flex justify-end';
      userMessageDiv.innerHTML = `<div class="bg-violet-700 dark:bg-blue-800 text-white rounded-2xl rounded-tr-sm p-3 max-w-[85%] text-sm shadow-sm"><p>${message}</p></div>`;
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
        
        // Renderizar respuesta de la IA
        const aiMessageDiv = document.createElement('div');
        aiMessageDiv.className = 'flex justify-start';
        aiMessageDiv.innerHTML = `<div class="bg-gray-800 dark:bg-gray-300 dark:text-black text-white rounded-2xl rounded-tl-sm p-3 max-w-[85%] text-sm shadow-sm"><p>${data.reply || data.error}</p></div>`;
        chatBox.appendChild(aiMessageDiv);
        chatBox.scrollTop = chatBox.scrollHeight;
  
        // Si el usuario cerró el chat mientras esperaba la respuesta, notificamos
        if (!isChatOpen) {
            unreadCount++;
            updateNotification();
        }
  
      } catch (error) {
        console.error('Error:', error);
      } finally {
        chatInput.disabled = false;
        sendButton.disabled = false;
        sendIcon.classList.remove('hidden');
        loadingSpinner.classList.add('hidden');
        if (isChatOpen) chatInput.focus();
      }
    });
  });