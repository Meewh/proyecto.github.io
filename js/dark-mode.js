function applyDarkMode() {
    const dark = localStorage.getItem("dark") === "true";

    const nav = document.getElementById("navbar");
    if (nav) nav.classList.toggle("dark", dark);
    document.body.classList.toggle("dark", dark);

    const logo = document.getElementById("logo");
    if (logo) logo.src = dark ? "img/logoDark.png" : "img/Logo.png";

    const navLinks = document.querySelectorAll(".navbar .nav-link");
    navLinks.forEach(link => {
        link.style.color = dark ? "#2B2B2B" : "#ffffff";
    });

    const jumbo = document.getElementById("jumbotron");
    if (jumbo) jumbo.classList.toggle("dark", dark);

    const album = document.getElementById("album")
    if (album) album.classList.toggle("dark", dark);
    if (album) album.classList.toggle("bg-light", !dark);

    const categories = document.getElementById("categories-container");
    if (categories) categories.classList.toggle("dark", dark);

    const yMuchoMas = document.getElementById("y-mucho-mas");
    if (yMuchoMas) yMuchoMas.classList.toggle("dark", dark);




    const dropdownLinks = document.querySelectorAll(".navbar .dropdown-menu a");
    dropdownLinks.forEach(link => {
        link.style.color = dark ? "#2B2B2B" : "#000000";
    });
}

function setupDarkModeToggle() {
    const toggle = document.querySelector("#theme");
    if (!toggle) return;

    toggle.addEventListener("click", () => {
        const dark = localStorage.getItem("dark") === "true";
        localStorage.setItem("dark", dark ? "false" : "true");
        applyDarkMode();
    });
}

document.addEventListener("DOMContentLoaded", () => {
    applyDarkMode();
    setupDarkModeToggle();
});
