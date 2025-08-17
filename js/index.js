document.addEventListener("DOMContentLoaded", function() {
    const userMenuBtn = document.getElementById("userMenuBtn");
    const userMenu = document.getElementById("userMenu");
    const bienvenida = document.getElementById("bienvenida");
    const flecha = document.getElementById("flecha");

    const usuario = localStorage.getItem("usuario");
    const logueado = localStorage.getItem("logueado");

    
    if (logueado !== "true" || !usuario) {
        let deseaLogin = confirm("No has iniciado sesión, ¿deseas hacerlo?"); //esto pregunta si quieres iniciar sesion o no
        if (deseaLogin) {
            window.location.href = "login.html"; 
            return; // para que no siga ejecutando el resto
        } else {
            bienvenida.textContent = "Iniciar sesión";
            userMenu.innerHTML = `
              <li style="padding: 8px 12px; cursor: pointer;"><a href="login.html">Login</a></li>
            `;
        }
    } else {
        // user logueado
        bienvenida.textContent = "Bienvenido, " + usuario;
        userMenu.innerHTML = `
          <li style="padding: 8px 12px; cursor: pointer;"><a href="my-profile.html">Mi Perfil</a></li>
          <li style="padding: 8px 12px; cursor: pointer;">
            <button id="logoutBtn" style="background:none;border:none;cursor:pointer;">Cerrar sesión</button>
          </li>
        `;
    }

    
    let abierto = false; //abre y cierra menu
    userMenuBtn.addEventListener("click", () => {
        abierto = !abierto;
        userMenu.style.display = abierto ? "block" : "none";
        flecha.textContent = abierto ? "▲" : "▼";
    });

    
    userMenu.addEventListener("click", (e) => { //cierra sesion y recarga
        if (e.target && e.target.id === "logoutBtn") {
            localStorage.removeItem("usuario");
            localStorage.removeItem("logueado");
            location.reload();
        }
    });

    
    document.addEventListener("click", (e) => { //si clickea fuera del menu se cierra igual
        if (!userMenuBtn.contains(e.target) && !userMenu.contains(e.target)) {
            userMenu.style.display = "none";
            flecha.textContent = "▼";
            abierto = false;
        }
    });
});
