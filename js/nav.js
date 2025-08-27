document.addEventListener("DOMContentLoaded", () => {
    inicializarNavbar(); // 2. Lógica del navbar
});

function inicializarNavbar() {
    const userMenuBtn = document.getElementById("userMenuBtn");
    const userMenu = document.getElementById("userMenu");
    const bienvenida = document.getElementById("bienvenida");
    const flecha = document.getElementById("flecha");

    const usuario = localStorage.getItem("usuario");
    const logueado = localStorage.getItem("logueado");

    if (logueado !== "true" || !usuario) {
        bienvenida.textContent = "Iniciar sesión";
        userMenu.innerHTML = `
      <li style="padding: 8px 12px; cursor: pointer;"><a href="login.html">Login</a></li>
    `;
    } else {
        bienvenida.textContent = "Bienvenido, " + usuario;
        userMenu.innerHTML = `
      <li style="padding: 8px 12px; cursor: pointer;"><a href="my-profile.html">Mi Perfil</a></li>
      <li style="padding: 8px 12px; cursor: pointer;">
        <button id="logoutBtn" style="background:none;border:none;cursor:pointer;">Cerrar sesión</button>
      </li>
    `;
    }

    let abierto = false;
    userMenuBtn.addEventListener("click", () => {
        abierto = !abierto;
        userMenu.style.display = abierto ? "block" : "none";
        flecha.textContent = abierto ? "▲" : "▼";
    });

    userMenu.addEventListener("click", (e) => {
        if (e.target && e.target.id === "logoutBtn") {
            localStorage.removeItem("usuario");
            localStorage.removeItem("logueado");
            location.reload();
        }
    });

    document.addEventListener("click", (e) => {
        if (!userMenuBtn.contains(e.target) && !userMenu.contains(e.target)) {
            userMenu.style.display = "none";
            flecha.textContent = "▼";
            abierto = false;
        }
    });

    // ✅ Lógica de redirección para las cards de categorías (si existen en la página)
    const categoryCards = document.getElementsByClassName("category-link");
    for (let card of categoryCards) {
        card.addEventListener("click", () => {
            window.location.href = "products.html";
        });
    }
}
