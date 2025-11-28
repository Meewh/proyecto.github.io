document.getElementById("btnRegistro").addEventListener("click", function(){
    window.location.href = "registro.html";
});

document.getElementById("loginForm").addEventListener("submit", async function(e) {
    e.preventDefault();

    const usuario = document.getElementById("usuario").value.trim();
    const contraseña = document.getElementById("contraseña").value.trim();

    if (usuario === "" || contraseña === "") {
        document.getElementById("mensaje").textContent = "Por favor, completa todos los campos.";
        return;
    }

    try {
        const response = await fetch('http://localhost:3000/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ 
                username: usuario, 
                password: contraseña 
            })
        });

        const data = await response.json();

        if (response.ok) {
            // GUARDAMOS EL TOKEN REAL
            localStorage.setItem("token", data.token);
            localStorage.setItem("usuario", usuario);
            localStorage.setItem("logueado", "true");

            // Mensaje lindo y redirección
            document.getElementById("mensaje").style.color = "green";
            document.getElementById("mensaje").textContent = "¡Login exitoso! Redirigiendo...";
            
            setTimeout(() => {
                window.location.href = "index.html";
            }, 1000);
        } else {
            document.getElementById("mensaje").style.color = "red";
            document.getElementById("mensaje").textContent = data.mensaje || "Usuario o contraseña incorrectos";
        }
    } catch (error) {
        document.getElementById("mensaje").style.color = "red";
        document.getElementById("mensaje").textContent = "Error de conexión con el servidor";
    }
});