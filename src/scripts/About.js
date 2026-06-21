document.addEventListener('DOMContentLoaded', () => {
      const toggleButton = document.getElementById('toggle-button');
      const statusContent = document.getElementById('status-content');
      const arrowIcon = toggleButton.querySelector(".arrow-icon");
      const statusContainer = document.getElementById('status-container');
  
      toggleButton.addEventListener('click', () => {
  // Alterna el contenido (ya existente)
  statusContent.classList.toggle('hidden');
  arrowIcon.classList.toggle('rotate-0');
  arrowIcon.classList.toggle('rotate-90');
  
  // Alterna las clases de fondo en el contenedor
  statusContainer.classList.toggle('bg-gray-900');
  statusContainer.classList.toggle('dark:bg-sky-100');
  
  // Alterna las clases de borde en el elemento con el borde (en este ejemplo, el primer div con clase "relative border")
  const borderDiv = statusContainer.querySelector('.relative.border');
  if (borderDiv) {
    borderDiv.classList.toggle('border-gray-900');
    borderDiv.classList.toggle('dark:border-blue-200');
  }
});

    });