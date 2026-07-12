
document.addEventListener("DOMContentLoaded", () => {
    const dropdownButton = document.getElementById("dropdownDefaultButton");
    const dropdownMenu = document.getElementById("dropdowndelay");
    const arrowIcon = dropdownButton.querySelector(".arrow-icon");
    
        dropdownButton.addEventListener("click", () => {

            dropdownMenu.classList.toggle("hidden");
    

                arrowIcon.classList.toggle("rotate-180");
            });
        });
