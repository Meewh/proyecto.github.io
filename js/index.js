document.addEventListener("DOMContentLoaded", function () {
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
            localStorage.removeItem("usuario");
            localStorage.removeItem("logueado");
            location.reload();
        }
    });

    // Carga de categorías y creación de cards
const CATEGORIES_URL = "https://japceibal.github.io/emercado-api/cats/cat.json";
    const categoriesContainer = document.getElementById("categories-container");

    fetch(CATEGORIES_URL)
        .then(response => response.json())
        .then(categories => {
            categories.forEach(cat => {
                // Creamos la card de la categoría
                const div = document.createElement("div");
                div.classList.add("col-md-4");

                // Aquí ajustamos para usar cat101_1, cat104_1, etc.
                const imageFile = `img/cat${cat.id}_1.jpg`;

                div.innerHTML = `
                    <div class="category-link card mb-4 shadow-sm custom-card cursor-active" data-id="${cat.id}">
                    <img class="bd-placeholder-img card-img-top" src="img/cat${cat.id}_1.jpg" alt="Imagen de ${cat.name}">
                        <h3 class="m-3">${cat.name}</h3>
                        <div class="card-body">
                            <p class="card-text">${cat.description}</p>
                        </div>
                    </div>
                `;

                // Agregamos evento click para redirigir a products.html
                div.querySelector(".category-link").addEventListener("click", () => {
                    localStorage.setItem("catID", cat.id); // guardamos el id de la categoría
                    window.location.href = "products.html";
                });

                categoriesContainer.appendChild(div);
            });
        })
        .catch(error => console.error("Error cargando categorías:", error));
});
