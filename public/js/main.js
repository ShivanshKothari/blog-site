document.querySelector("#menu").addEventListener("click", () => {
    const menuButton = document.querySelector("#menuButton > i");
    menuButton.innerHTML = menuButton.classList.toggle("fa-bars");
    menuButton.innerHTML = menuButton.classList.toggle("fa-xmark");
    menuButton.innerHTML = '';
    
})