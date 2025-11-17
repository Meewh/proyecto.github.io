document.addEventListener("DOMContentLoaded", () => {
  const profileBtn = document.getElementById("profile-btn");
  const profileMenu = document.getElementById("profile-menu");
  const userNameElem = document.getElementById("user-name");
  const profileImgElem = document.getElementById("foto_perfil");

  // Obtención de datos del usuario desde localStorage
  const usuario = localStorage.getItem("usuario");
  const logueado = localStorage.getItem("logueado");

  if (logueado === "true" && usuario) {
    userNameElem.textContent = usuario;

    // Mostrar la foto de perfil
    const userPhoto = localStorage.getItem("photo");
    if (userPhoto) {
      profileImgElem.src = userPhoto;
      profileImgElem.style.display = "block";
      profileBtn.innerHTML = `<img src="${userPhoto}" alt="Foto de perfil" style="width: 30px; height: 30px; border-radius: 50%; object-fit: cover;"> ${usuario}`;
    }

    // Actualización del menú de perfil
    document.getElementById("login-link").style.display = "none";
    document.getElementById("signup-link").style.display = "none";
    document.getElementById("my-profile-link").style.display = "block";
    document.getElementById("settings-link").style.display = "block";
    document.getElementById("accessibility-link").style.display = "block";
    document.getElementById("logout-link").style.display = "block";
  } else {
    // Si no está logueado
    document.getElementById("login-link").style.display = "block";
    document.getElementById("signup-link").style.display = "block";
    document.getElementById("my-profile-link").style.display = "none";
    document.getElementById("settings-link").style.display = "none";
    document.getElementById("accessibility-link").style.display = "none";
    document.getElementById("logout-link").style.display = "none";
  }

  // Cierre de sesión
  const logoutBtn = document.getElementById("logout-btn");
  if (logoutBtn) {
    logoutBtn.addEventListener("click", () => {
      localStorage.clear();
      location.reload();
    });
  }

  // Perfil desplegable
  let isMenuOpen = false;
  profileBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    profileMenu.classList.toggle("active");
    isMenuOpen = !isMenuOpen;
  });

  // Cerrar el menú si se hace clic fuera de él
  document.addEventListener("click", (e) => {
    if (!profileMenu.contains(e.target) && !profileBtn.contains(e.target)) {
      profileMenu.style.display = "none";
      isMenuOpen = false;
    }
  });

  // Carrito
  const cartCountElem = document.getElementById("cart-count");
  let cartItems = JSON.parse(localStorage.getItem("cart")) || [];
  cartCountElem.textContent = cartItems.length;

  // Notificaciones
  const notificationsBtn = document.getElementById("notifications-btn");
  notificationsBtn.addEventListener("click", () => {
    const notificationsMenu = document.createElement("div");
    notificationsMenu.classList.add("notifications-menu");

    if (cartItems.length > 0) {
      notificationsMenu.innerHTML = `
                <div><strong>Cuenta</strong></div>
                <div><strong>Novedades</strong></div>`;
    } else {
      notificationsMenu.innerHTML = `<p>No hay notificaciones aun!</p>`;
    }

    document.body.appendChild(notificationsMenu);
  });
});

// Carrito: Actualiza el número de items en el carrito
function updateCartCount() {
  const cartCountElem = document.getElementById("cart-count");
  let cartItems = JSON.parse(localStorage.getItem("cart")) || [];
  cartCountElem.textContent = cartItems.length;
}

// Función para mostrar los productos en el carrito
function showCart() {
  const cartItems = JSON.parse(localStorage.getItem("cart")) || [];
  const cartContainer = document.getElementById("cart-container");

  if (cartItems.length === 0) {
    cartContainer.innerHTML = `<div class="text-center py-12">
                                        <span class="material-symbols-outlined text-6xl text-text-light-secondary dark:text-text-dark-secondary mb-4">shopping_cart</span>
                                        <p class="text-lg text-text-light-secondary dark:text-text-dark-secondary">No hay productos en el carrito</p>
                                    </div>`;
  } else {
    cartContainer.innerHTML = cartItems.map(item => `
            <div>${item.name}</div>
        `).join("");
  }
}
