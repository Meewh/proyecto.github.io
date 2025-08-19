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

//Codigo gio - inicio
// document.addEventListener("DOMContentLoaded", function() {
//   const btn = document.querySelector("button");

//   btn.addEventListener("click", function() {
//     const nombre = document.getElementById("nombre").value.trim();
//     const apellido = document.getElementById("apellido").value.trim();
//     const direccion = document.getElementById("direccion").value.trim();
//     const telefono = document.getElementById("telefono").value.trim();

//     if (!nombre || !apellido || !direccion || !telefono) {
//       alert("⚠️ Faltan datos. Por favor, completa todos los campos.");
//     } else {
//       alert("✅ Registro completado con éxito.");
//     }
//   });
//Codigo gio - fin