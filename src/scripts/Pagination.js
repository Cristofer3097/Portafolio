document.addEventListener('DOMContentLoaded', () => {
const itemsPerPage = 4;
let currentPage = 1;

const projects = document.querySelectorAll('.project-card');
const totalPages = Math.ceil(projects.length / itemsPerPage);
const prevBtn = document.getElementById('prev-btn');
const nextBtn = document.getElementById('next-btn');
const pageInfo = document.getElementById('page-info');

// Función para mostrar los proyectos de la página actual
function showPage(page) {
    const start = (page - 1) * itemsPerPage;
    const end = start + itemsPerPage;

    projects.forEach((project, index) => {
    if (index >= start && index < end) {
        project.classList.remove('hidden');
        project.classList.add('animate-fade-in'); 
    } else {
        project.classList.add('hidden');
    }
    });

    updateButtons();
      
    // Actualizar texto del indicador
    if(pageInfo) pageInfo.textContent = `${currentPage} / ${totalPages}`;
}

// Función para controlar la visibilidad de los botones
function updateButtons() {
    if (!prevBtn || !nextBtn) return;

    // Botón Anterior
    if (currentPage === 1) {
    prevBtn.classList.add('invisible'); // Ocultar pero mantener espacio (o usa hidden para quitar espacio)
    } else {
    prevBtn.classList.remove('invisible');
    }

    // Botón Siguiente
    if (currentPage === totalPages) {
    nextBtn.classList.add('invisible');
    } else {
    nextBtn.classList.remove('invisible');
    }
}

// Event Listeners
if (prevBtn) {
    prevBtn.addEventListener('click', () => {
    if (currentPage > 1) {
        currentPage--;
        showPage(currentPage);
        // Scroll suave hacia el título de proyectos para no quedar abajo
        document.getElementById('proyectos')?.scrollIntoView({ behavior: 'smooth' });
    }
    });
}

if (nextBtn) {
    nextBtn.addEventListener('click', () => {
    if (currentPage < totalPages) {
        currentPage++;
        showPage(currentPage);
        document.getElementById('proyectos')?.scrollIntoView({ behavior: 'smooth' });
    }
    });
}

// Inicializar
showPage(1);
});
