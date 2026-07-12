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
