document.addEventListener('DOMContentLoaded', () => {
    const section = document.getElementById('certificate-section');
    if(!section) return; 

    const certificadosData = JSON.parse(section.getAttribute('data-certificates'));
    const carouselTrack = document.getElementById("carouselTrack");
    if(!carouselTrack) return;

    let isPaused = false;
    let currentX = 0;
    let isDragging = false;
    let startX = 0;
    let lastX = 0;
    let halfWidth = 0;
    let dragDistance = 0;
    let currentIndex = 0;

    // Evita que el navegador intente "arrastrar" la imagen nativamente
    document.querySelectorAll('.carousel-image').forEach(img => {
        img.setAttribute('draggable', 'false');
    });

    function updateHalfWidth() {
        halfWidth = carouselTrack.scrollWidth / 2;
    }

    window.addEventListener('resize', updateHalfWidth);
    setTimeout(updateHalfWidth, 500);

    // Bucle de animación
    function animateCarousel() {
        const modal = document.getElementById("modal");
        const isModalOpen = modal && !modal.classList.contains("hidden");

        if (!isPaused && !isDragging && !isModalOpen) {
            currentX -= 1; // Velocidad de la ruleta
        }

        // Bucle infinito perfecto
        if (halfWidth > 0) {
            if (currentX <= -halfWidth) {
                currentX += halfWidth;
            } else if (currentX > 0) {
                currentX -= halfWidth;
            }
        }

        carouselTrack.style.transform = `translateX(${currentX}px)`;
        requestAnimationFrame(animateCarousel);
    }

    animateCarousel(); 

    // Eventos Mouse (Escritorio)
    carouselTrack.addEventListener('mousedown', (e) => {
        isDragging = true;
        dragDistance = 0;
        startX = e.pageX;
        lastX = e.pageX;
        carouselTrack.style.cursor = 'grabbing';
        isPaused = true;
    });

    window.addEventListener('mousemove', (e) => {
        if (!isDragging) return;
        e.preventDefault();
        const currentPos = e.pageX;
        dragDistance = Math.abs(currentPos - startX); 
        currentX += (currentPos - lastX); 
        lastX = currentPos;
    });

    window.addEventListener('mouseup', () => {
        if (isDragging) {
            isDragging = false;
            carouselTrack.style.cursor = 'grab';
            isPaused = false;
        }
    });

    // Eventos Touch (Móviles)
    carouselTrack.addEventListener('touchstart', (e) => {
        isDragging = true;
        dragDistance = 0;
        startX = e.touches[0].clientX;
        lastX = e.touches[0].clientX;
        isPaused = true;
    }, { passive: true });

    window.addEventListener('touchmove', (e) => {
        if (!isDragging) return;
        const currentPos = e.touches[0].clientX;
        dragDistance = Math.abs(currentPos - startX);
        currentX += (currentPos - lastX);
        lastX = currentPos;
    }, { passive: true });

    window.addEventListener('touchend', () => {
        if (isDragging) {
            isDragging = false;
            isPaused = false;
        }
    });

    // Pausar animación con hover 
    carouselTrack.addEventListener("mouseenter", () => { isPaused = true; });
    carouselTrack.addEventListener("mouseleave", () => { if (!isDragging) isPaused = false; });

    window.openModal = function(index) {
      if (dragDistance > 5) return; 

      currentIndex = index;
      updateModalContent();

      const modal = document.getElementById("modal");
      const modalImage = document.getElementById("modalImage");
      
      modal.classList.remove("hidden");
      document.body.classList.add("overflow-hidden");

      setTimeout(() => {
        modalImage.classList.remove("scale-75", "opacity-0");
        modalImage.classList.add("scale-100", "opacity-100");
      }, 50);
    }

    function updateModalContent() {
        const modalImage = document.getElementById("modalImage");
        const modalTitle = document.getElementById("modalTitle");
        const item = certificadosData[currentIndex];
        
        modalImage.src = item.image;
        modalTitle.textContent = item.name;
    }

    window.nextImage = function() {
        currentIndex = (currentIndex + 1) % certificadosData.length;
        changeImageAnimation();
    }

    window.prevImage = function() {
        currentIndex = (currentIndex - 1 + certificadosData.length) % certificadosData.length;
        changeImageAnimation();
    }

    function changeImageAnimation() {
        const modalImage = document.getElementById("modalImage");
        modalImage.classList.add("opacity-50", "scale-95");
        setTimeout(() => {
            updateModalContent();
            modalImage.classList.remove("opacity-50", "scale-95");
        }, 150);
    }

    window.closeModal = function() {
      const modal = document.getElementById("modal");
      const modalImage = document.getElementById("modalImage");

      modalImage.classList.remove("scale-100", "opacity-100");
      modalImage.classList.add("scale-75", "opacity-0");

      setTimeout(() => {
        modal.classList.add("hidden");
        document.body.classList.remove("overflow-hidden");
      }, 300);
    }

    // Controles por teclado y botones
    document.getElementById('prevBtn')?.addEventListener('click', (e) => {
        e.stopPropagation();
        window.prevImage();
    });

    document.getElementById('nextBtn')?.addEventListener('click', (e) => {
        e.stopPropagation();
        window.nextImage();
    });

    document.addEventListener('keydown', (e) => {
        const modal = document.getElementById("modal");
        if (modal && !modal.classList.contains("hidden")) {
            if (e.key === "ArrowRight") window.nextImage();
            if (e.key === "ArrowLeft") window.prevImage();
            if (e.key === "Escape") window.closeModal();
        }
    });
});