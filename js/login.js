
const togglePassword = document.getElementById("togglePassword");
const passwordInput = document.getElementById("contraseña");

if (togglePassword) {
    togglePassword.addEventListener("click", function() {
        const type = passwordInput.getAttribute("type") === "password" ? "text" : "password";
        passwordInput.setAttribute("type", type);

        this.textContent = type === "password" ? "visibility" : "visibility_off";

        this.setAttribute('aria-label', type === 'password' ? 'Mostrar contraseña' : 'Ocultar contraseña');
    });
}

// Update theme toggle icon based on dark mode state
function updateThemeIcon() {
    const themeButton = document.getElementById("theme");
    if (themeButton) {
        const dark = localStorage.getItem("dark") === "true";
        themeButton.textContent = dark ? "dark_mode" : "light_mode";
        themeButton.setAttribute('aria-label', dark ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro');
    }
}


document.addEventListener("DOMContentLoaded", function() {
    updateThemeIcon();
});

document.getElementById("btnRegistro").addEventListener("click", function(){

    window.location.href = "registro.html";
});

document.getElementById("loginForm").addEventListener("submit", function(e) {
    e.preventDefault(); // evita que recargue la página y se pierda las cosas

    const usuario = document.getElementById("usuario").value;
    const contraseña = document.getElementById("contraseña").value;

    if (usuario.trim() !== "" && contraseña.trim() !== "") {
        // guarda sesion
        localStorage.setItem("usuario", usuario);
        localStorage.setItem("logueado", "true");
    
        // redirigir al inicio
        window.location.href = "index.html";
    } else {
        document.getElementById("mensaje").textContent = "Por favor, completa todos los campos.";
    }
});

