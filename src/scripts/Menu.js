document.addEventListener('DOMContentLoaded', () => {
    const sideNav = document.getElementById('side-menu');
    
    if (!sideNav) return; 
    
    const navLinks = sideNav.querySelectorAll('a'); 

    window.addEventListener('scroll', () => {
      let current = '';
      const sections = document.querySelectorAll('.scroll-spy-section');
      const scrollPosition = window.pageYOffset + (window.innerHeight / 2.5);

      sections.forEach(section => {
        if (section.offsetHeight > 0) {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;

            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                current = section.getAttribute('id');
            }
        }
      });
      
      if (['skills', 'education', 'certificate'].includes(current)) {
        current = 'sobremi';
      }

      navLinks.forEach(link => {
        const listItem = link.parentElement;

        listItem.classList.remove('bg-violet-900', 'dark:bg-blue-900');
        
        link.style.color = ''; 

        if (current && link.getAttribute('href').includes(current)) {
          listItem.classList.add('bg-violet-900', 'dark:bg-blue-900');
          
          link.style.color = 'white';
        }

      });
      
    }, { passive: true });
  });