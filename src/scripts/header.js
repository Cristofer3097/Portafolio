// src/scripts/header.js

document.addEventListener('DOMContentLoaded', () => {
    
    // ==========================================
    // 1. LÓGICA DEL MENÚ LATERAL (MÓVIL)
    // ==========================================
    const menuToggle = document.getElementById('menu-toggle');
    const navMenu = document.getElementById('nav-menu');
    const closeMenu = document.getElementById('close-menu');
    const navLinks = document.querySelectorAll('#nav-menu a');

    if (menuToggle && navMenu && closeMenu) {
        // Abrir menú
        menuToggle.addEventListener('click', (e) => {
            e.stopPropagation();
            navMenu.classList.remove('translate-x-full');
            navMenu.classList.add('translate-x-0');
        });

        // Cerrar menú con botón X
        closeMenu.addEventListener('click', () => {
            navMenu.classList.remove('translate-x-0');
            navMenu.classList.add('translate-x-full');
        });

        // Cerrar menú al hacer clic en un enlace
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('translate-x-0');
                navMenu.classList.add('translate-x-full');
            });
        });

        // Evita que el menú se cierre si hacemos clic dentro
        navMenu.addEventListener('click', (e) => {
            e.stopPropagation();
        });

        // Cerrar menú al hacer clic fuera
        document.addEventListener('click', () => {
            navMenu.classList.remove('translate-x-0');
            navMenu.classList.add('translate-x-full');
        });
    }

    // ==========================================
    // 2. LÓGICA DE IDIOMAS Y TRADUCCIONES
    // ==========================================
    const languageMenu = document.getElementById('language-dropdown-menu');
    const currentLanguage = document.getElementById('current-language');
    const languageButton = document.getElementById('language-toggle-button');
    let translations = {};
    const storedLang = localStorage.getItem('language');
    let lang = storedLang || 'es'; // Idioma por defecto

    // Cargar JSON de idioma
    async function loadLanguage(langCode) {
        try {
            const response = await fetch(`/locales/${langCode}.json`);
            if (!response.ok) throw new Error(`Failed to fetch translations`);

            translations = await response.json();
            localStorage.setItem('language', langCode);
            lang = langCode;

            applyTranslations();
            updateLanguageButtonText(langCode);
        } catch (error) {
            console.error('Error loading language:', error);
        }
    }

    function updateLanguageButtonText(langCode) {
        if (currentLanguage) {
            currentLanguage.textContent = (langCode === 'es') ? 'Español' : 'English';
        }
    }

    // Aplicar traducciones
    function applyTranslations() {
        // Textos generales
        document.querySelectorAll('[data-translate]').forEach(el => {
            const key = el.getAttribute('data-translate');
            el.textContent = key.split('.').reduce((obj, k) => obj && obj[k], translations) || el.textContent;
        });

        // Placeholders
        document.querySelectorAll('[data-translate-placeholder]').forEach(el => {
            const key = el.getAttribute('data-translate-placeholder');
            const translation = key.split('.').reduce((obj, k) => obj && obj[k], translations);
            if (translation) {
                el.setAttribute('placeholder', translation);
            }
        });

        // Títulos (Tooltips nativos)
        document.querySelectorAll('[data-translate-title]').forEach(el => {
            const key = el.getAttribute('data-translate-title');
            const translation = key.split('.').reduce((obj, k) => obj && obj[k], translations);
            if (translation) {
                el.setAttribute('title', translation);
            }
        });

        if(currentLanguage) {
            currentLanguage.textContent = (lang === 'es') ? 'Español' : 'English';
        }

        // Experiencia laboral
        const experienceElements = document.querySelectorAll('[data-translate-experience]');
        experienceElements.forEach((element, index) => {
            const exp = translations.experience?.[index];
            if (exp) {
                const titleEl = element.querySelector('.experience-title');
                if (titleEl) titleEl.textContent = exp.title;

                const dateEl = element.querySelector('.experience-date');
                if (dateEl) dateEl.textContent = exp.date;

                const listItems = element.querySelectorAll('li');

                if (exp.description && Array.isArray(exp.description)) {
                    listItems.forEach((li, i) => {
                        if (exp.description[i] && exp.description[i].trim() !== "") {
                            li.innerHTML = exp.description[i];
                            li.style.display = 'list-item';
                        } else {
                            li.style.display = 'none';
                        }
                    });
                } else if (typeof exp.description === 'string') {
                    if (listItems[0]) {
                        listItems[0].innerHTML = exp.description;
                        listItems[0].style.display = 'list-item';
                    }
                }
            }
        });

        // Proyectos
        const projectElements = document.querySelectorAll('[data-translate-project]');
        projectElements.forEach((element, index) => {
            const proj = translations.project?.[index];
            if (proj) {
                const descEl = element.querySelector('.project-description');
                if (descEl) descEl.textContent = proj.description;
            }
        });

        // Chat AI
        const chatFirstMessage = document.getElementById('chat-first-message');
        if (chatFirstMessage && translations.chat?.firstMessage) {
            chatFirstMessage.textContent = translations.chat.firstMessage;
        }

        const chatInput = document.getElementById('chat-input');
        if (chatInput && translations.chat?.placeholder) {
            chatInput.placeholder = translations.chat.placeholder;
        }

        const chatButtonText = document.getElementById('chat-send-text');
        if (chatButtonText && translations.chat?.button) {
            chatButtonText.textContent = translations.chat.button;
        }
    }

    // Eventos del Menú de Idiomas
    if (languageButton && languageMenu) {
        languageButton.addEventListener('click', (event) => {
            event.stopPropagation();
            languageMenu.classList.toggle('hidden');
        });

        document.querySelectorAll('[data-lang]').forEach(button => {
            button.addEventListener('click', (e) => {
                e.preventDefault();
                lang = button.getAttribute('data-lang');
                loadLanguage(lang);
                languageMenu.classList.add('hidden');
            });
        });

        document.addEventListener('click', () => {
            if (!languageMenu.classList.contains('hidden')) {
                languageMenu.classList.add('hidden');
            }
        });

        languageMenu.addEventListener('click', (event) => {
            event.stopPropagation();
        });
    }

    // ==========================================
    // 3. LÓGICA DEL TEMA OSCURO/CLARO
    // ==========================================
    const themeToggle = document.getElementById('theme-toggle');
    const themeIcon = document.getElementById('theme-icon');
    const savedTheme = localStorage.getItem('theme') || 'dark';

    document.documentElement.classList.toggle('dark', savedTheme === 'dark');
    updateThemeIcon(savedTheme);

    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            const isDark = document.documentElement.classList.toggle('dark');
            localStorage.setItem('theme', isDark ? 'dark' : 'light');
            updateThemeIcon(isDark ? 'dark' : 'light');
        });
    }

    function updateThemeIcon(theme) {
        if (!themeIcon) return;
        
        if (theme === 'dark') {
            themeIcon.innerHTML = `
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m8.66-8.66h-1M4.34 12H3m15.36-6.36l-.7.7m-12.02 12.02l-.7.7m12.02.7l-.7-.7M6.34 6.34l-.7-.7M12 5a7 7 0 100 14 7 7 0 000-14z" />
                </svg>`;
        } else {
            themeIcon.innerHTML = `
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" stroke="none">
                    <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" />
                </svg>`;
        }
    }

    // Inicializar idioma al cargar la página
    loadLanguage(lang);
});