document.getElementById("btnRegistro").addEventListener("click", function(){
    //pagina de registro
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
