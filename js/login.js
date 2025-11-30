document.getElementById("btnRegistro").addEventListener("click", function(){
    //pagina de registro
    window.location.href = "registro.html";
});

async function login(event) {
    event.preventDefault();

    const correo = document.getElementById("correo").value;
    const contraseña = document.getElementById("contraseña").value;

    try {
        const res = await fetch("http://localhost:3000/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ correo, contraseña })
        });

        const data = await res.json();

        // SI EL LOGIN Falla → Mostrar toast
        if (!res.ok) {
            mostrarToast(data.message || "Error al iniciar sesión");
            return;
        }

        // Guardar datos en localStorage
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));

        // Redirigir
        window.location.href = "index.html";

    } catch (err) {
        mostrarToast("No se pudo conectar con el servidor");
    }
}

function mostrarToast(msg) {
    const toastEl = document.getElementById("toastMsg");
    const toastText = document.getElementById("toastText");
    const toast = new bootstrap.Toast(toastEl);

    toastText.textContent = msg;
    toast.show();
}
