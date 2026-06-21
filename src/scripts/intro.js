document.addEventListener("DOMContentLoaded", () => {
        const textElement = document.getElementById("changing-text");
        const cursorElement = document.getElementById("typed-cursor");
        const words = ["Full-Stack","Frontend", "Backend", ".NET"];
        let wordIndex = 0;
        let charIndex = 0;
        let isDeleting = false;
        
        function typeEffect() {
            const currentWord = words[wordIndex];
            
            if (isDeleting) {
                textElement.textContent = currentWord.substring(0, charIndex - 1);
                charIndex--;
            } else {
                textElement.textContent = currentWord.substring(0, charIndex + 1);
                charIndex++;
            }

            let typingSpeed = isDeleting ? 50 : 100;

            // Cuando termina de escribir, activa el parpadeo del cursor antes de borrar
            if (!isDeleting && charIndex === currentWord.length) {
                cursorElement.classList.add("blinking");
                setTimeout(() => {
                    isDeleting = true;
                    cursorElement.classList.remove("blinking");
                    typeEffect();
                }, 2000); // Espera antes de borrar
                return;
            }

            // Cuando termina de borrar, cambia de palabra
            if (isDeleting && charIndex === 0) {
                isDeleting = false;
                wordIndex = (wordIndex + 1) % words.length;
                typingSpeed = 500; // Pausa antes de escribir la siguiente palabra
            }

            setTimeout(typeEffect, typingSpeed);
        }

        typeEffect();
    });

    document.addEventListener("DOMContentLoaded", () => {
        const elements = document.querySelectorAll(".hidden-on-scroll");
    
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add("visible-on-scroll");
                } else {
                    entry.target.classList.remove("visible-on-scroll");
                }
            });
        }, { threshold: 0.3 }); 
    
        elements.forEach(el => observer.observe(el));
    });