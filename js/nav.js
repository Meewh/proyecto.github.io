document.addEventListener("DOMContentLoaded", () => {

  const nav = document.getElementById("navbar");
  if (localStorage.getItem("cart") === null) {
    localStorage.setItem("cart", [])
  }
  const productos = JSON.parse(localStorage.getItem("cart") || "[]");

  nav.innerHTML = `
  
    <div class="form-left"> <!-- esto va a la izquierda -->
      <img src="img/Logo.png" alt="Logo" class="logo" id="logo">
    </div>
    <div class="container" id="navbar">
      <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav"
        aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
      </button>
      <div class="collapse navbar-collapse" id="navbarNav">
        <ul class="navbar-nav w-100 justify-content-between">
          <li class="nav-item">
            <a class="nav-link" href="index.html">Inicio</a>
          </li>
          <li class="nav-item">
            <a class="nav-link" href="categories.html">Categorías</a>
          </li>
          <li class="nav-item">
            <a class="nav-link" href="sell.html">Vender</a>
          </li>
          <li class="nav-item dropdown" style="position: relative;">
            <button id="userMenuBtn" class="nav-link" style="background:none;border:none;cursor:pointer;">

              <span id="bienvenida">Iniciar sesión</span> <span id="flecha" class="bi bi-caret-down-fill"></span>


            </button>
            <ul id="userMenu" style="
                display: none;
                position: absolute;
                top: 100%;
                left: 0;
                background: white;
                border: 1px solid #ccc;
                border-radius: 5px;
                list-style: none;
                padding: 0;
                margin: 0;
                min-width: 150px;
                z-index: 9999;
            ">
              <!-- guarda temporalmente todo en el cache de la pag -->
            </ul>
          </li>

          
          
        </ul>
        <a class="nav-link position-relative" href="cart.html" id="cart-link">
        <i class="bi bi-cart3 fs-5"></i>
        <span class="position-absolute top-10 start-90 translate-middle badge rounded-pill bg-warning" id="cart-count" style="font-size: 0.7rem;">
          ${productos.length}
        </span>
      </a>
        <div class="nav-item justify-content-left">
          <a class="nav-link" id="theme" style="cursor: pointer;">Tema</a>
        </div>
      </div>


    </div>
    `
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
              <li style="padding: 8px 12px; cursor: pointer;"><a href="registro.html">Crear cuenta</a></li>
            `;
    }
  } else {
    // user logueado
    bienvenida.textContent = usuario;
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

    // Remover clases existentes y agregar la nueva
    flecha.classList.remove("bi-caret-down-fill", "bi-caret-up-fill");
    flecha.classList.add(abierto ? "bi-caret-up-fill" : "bi-caret-down-fill");
  });

  userMenu.addEventListener("click", (e) => { //cierra sesion y recarga
    if (e.target && e.target.id === "logoutBtn") {
      //elimina todo lo guardado, incluyendo los datos del perfil
      localStorage.clear();
      location.reload();
    }
  });

});



