
function openVideoModal(videoUrl) {
    const modal = document.getElementById("videoModal");
    const modalVideo = document.getElementById("modalVideo");

    modalVideo.src = videoUrl; 
    modal.classList.remove("hidden");

    setTimeout(() => {
        modalVideo.classList.remove("scale-75", "opacity-0");
        modalVideo.classList.add("scale-100", "opacity-100");
        modalVideo.play(); 
    }, 50);
}

function closeVideoModal() {
    const modal = document.getElementById("videoModal");
    const modalVideo = document.getElementById("modalVideo");

    modalVideo.pause(); 
    modalVideo.classList.remove("scale-100", "opacity-100");
    modalVideo.classList.add("scale-75", "opacity-0");

    setTimeout(() => {
        modal.classList.add("hidden");
        modalVideo.src = ""; 
    }, 300);
}

window.openVideoModal = openVideoModal;
window.closeVideoModal = closeVideoModal;
  
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