document.addEventListener("DOMContentLoaded", () => {
  const nav = document.getElementById("navbar");

  nav.innerHTML = `
    <style>
      /* VARIABLES */
      :root {
        --nav-bg: #ffffff;
        --nav-text: #190d1b;
        --nav-hover: #f1e7f3;
        --nav-border: rgba(241, 231, 243, 0.3);
        --nav-shadow: rgba(25, 13, 27, 0.1);
      }

      .dark {
        --nav-bg: #21162d;
        --nav-text: #f7f6f8;
        --nav-hover: rgba(241, 231, 243, 0.1);
        --nav-border: #322340;
        --nav-shadow: rgba(0, 0, 0, 0.3);
      }

      /* RESET BÁSICO */
      .nav-desktop *, .nav-mobile * {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
      }

      /* ========== DESKTOP ========== */
      .nav-desktop {
        display: none;
        background: var(--nav-bg);
        border-bottom: 1px solid var(--nav-border);
        position: sticky;
        top: 0;
        z-index: 50;
        box-shadow: 0 2px 8px var(--nav-shadow);
      }

      @media (min-width: 1024px) {
        .nav-desktop {
          display: block;
        }
      }

      .nav-inner {
        max-width: 1280px;
        margin: 0 auto;
        padding: 0 1rem;
        display: flex;
        align-items: center;
        justify-content: space-between;
        height: 64px;
      }

      .nav-left {
        display: flex;
        align-items: center;
        gap: 2rem;
      }

      .brand {
        display: flex;
        align-items: center;
        gap: 0.75rem;
        text-decoration: none;
        color: var(--nav-text);
        font-weight: 700;
        font-size: 1.125rem;
        transition: opacity 0.2s;
      }

      .brand:hover {
        opacity: 0.8;
      }

      .brand-logo {
        width: 32px;
        height: 32px;
        border-radius: 8px;
      }

      .nav-links {
        display: flex;
        align-items: center;
        gap: 1.5rem;
      }

      .nav-links a {
        color: var(--nav-text);
        text-decoration: none;
        font-size: 0.875rem;
        font-weight: 500;
        transition: color 0.2s;
      }

      .nav-links a:hover {
        color: #756189;
      }

      .nav-right {
        display: flex;
        align-items: center;
        gap: 0.5rem;
      }

      /* BUSCADOR */
      .search-container {
        position: relative;
      }

      .search-toggle {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 40px;
        height: 40px;
        border: none;
        border-radius: 50%;
        background: var(--nav-hover);
        color: var(--nav-text);
        cursor: pointer;
        transition: background 0.2s;
      }

      .search-toggle:hover {
        background: #f1e7f3;
      }

      .search-input-wrapper {
        display: none;
        position: absolute;
        right: 0;
        top: calc(100% + 8px);
        min-width: 260px;
        background: var(--nav-bg);
        border: 1px solid var(--nav-border);
        border-radius: 12px;
        padding: 0.75rem;
        box-shadow: 0 4px 12px var(--nav-shadow);
      }

      .search-input-wrapper.active {
        display: block;
      }

      .search-input-wrapper input {
        width: 100%;
        padding: 0.5rem 0.75rem;
        border: 1px solid var(--nav-border);
        border-radius: 8px;
        background: var(--nav-bg);
        color: var(--nav-text);
        font-size: 0.875rem;
        outline: none;
      }

      .search-input-wrapper input:focus {
        border-color: #f1e7f3;
        box-shadow: 0 0 0 3px rgba(241, 231, 243, 0.2);
      }

      /* BOTONES ICONO */
      .icon-btn {
        display: flex;
        align-items: center;
        justify-content: center;
        position: relative;
        width: 40px;
        height: 40px;
        border: none;
        border-radius: 50%;
        background: var(--nav-hover);
        color: var(--nav-text);
        cursor: pointer;
        transition: background 0.2s;
      }

      .icon-btn:hover {
        background: #f1e7f3;
      }

      .badge {
        position: absolute;
        top: 4px;
        right: 4px;
        display: flex;
        align-items: center;
        justify-content: center;
        min-width: 18px;
        height: 18px;
        padding: 0 4px;
        background: #ef4444;
        color: white;
        font-size: 11px;
        font-weight: 700;
        border-radius: 9px;
      }

      /* PERFIL */
      .profile-btn {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        padding: 0.5rem 1rem;
        border: none;
        border-radius: 20px;
        background: var(--nav-hover);
        color: var(--nav-text);
        font-size: 0.875rem;
        font-weight: 500;
        cursor: pointer;
        transition: background 0.2s;
      }

      .profile-btn:hover {
        background: #f1e7f3;
      }

      .profile-menu {
        display: none;
        position: absolute;
        right: 0;
        top: calc(100% + 8px);
        min-width: 180px;
        background: var(--nav-bg);
        border: 1px solid var(--nav-border);
        border-radius: 12px;
        overflow: hidden;
        box-shadow: 0 4px 12px var(--nav-shadow);
        list-style: none;
      }

      .profile-menu.active {
        display: block;
      }

      .profile-menu li {
        border-bottom: 1px solid var(--nav-border);
      }

      .profile-menu li:last-child {
        border-bottom: none;
      }

      .profile-menu a,
      .profile-menu button {
        display: block;
        width: 100%;
        padding: 0.75rem 1rem;
        border: none;
        background: none;
        color: var(--nav-text);
        text-align: left;
        text-decoration: none;
        font-size: 0.875rem;
        cursor: pointer;
        transition: background 0.2s;
      }

      .profile-menu a:hover,
      .profile-menu button:hover {
        background: var(--nav-hover);
      }

      .profile-menu button {
        color: #ef4444;
      }

      /* ========== MÓVIL ========== */
      .nav-mobile {
        display: block;
      }

      @media (min-width: 1024px) {
        .nav-mobile {
          display: none;
        }
      }

      .nav-mobile-top {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 0.75rem 1rem;
        background: var(--nav-bg);
        border-bottom: 1px solid var(--nav-border);
        position: sticky;
        top: 0;
        z-index: 50;
      }

      .nav-mobile-top .brand {
        font-size: 1rem;
      }

      .nav-mobile-top .brand-logo {
        width: 28px;
        height: 28px;
      }

      .nav-mobile-top .icon-btn {
        width: 36px;
        height: 36px;
      }

      .nav-mobile-bottom {
        display: flex;
        align-items: center;
        justify-content: space-around;
        position: fixed;
        bottom: 0;
        left: 0;
        right: 0;
        padding: 0.5rem 0;
        background: var(--nav-bg);
        border-top: 1px solid var(--nav-border);
        z-index: 50;
      }

      .nav-mobile-bottom .icon-btn {
        flex-direction: column;
        gap: 0.25rem;
        width: auto;
        height: auto;
        padding: 0.25rem 0.5rem;
        background: transparent;
        border-radius: 8px;
        font-size: 0.75rem;
        font-weight: 500;
      }

      .nav-mobile-bottom .icon-btn:hover {
        background: var(--nav-hover);
      }

      .nav-mobile-bottom .icon-btn .material-symbols-outlined {
        font-size: 24px;
      }

      /* MOBILE SEARCH */
      #mobile-search-container {
        display: none;
        padding: 0 1rem 0.75rem;
        background: var(--nav-bg);
      }

      #mobile-search-container.active {
        display: block;
      }

      #mobile-search-container input {
        width: 100%;
        padding: 0.5rem 0.75rem;
        border: 1px solid var(--nav-border);
        border-radius: 8px;
        background: var(--nav-bg);
        color: var(--nav-text);
        font-size: 0.875rem;
        outline: none;
      }

      #mobile-search-container input:focus {
        border-color: #f1e7f3;
        box-shadow: 0 0 0 3px rgba(241, 231, 243, 0.2);
      }
    </style>

    <!-- NAVEGACIÓN DESKTOP -->
    <nav class="nav-desktop">
      <div class="nav-inner">
        <div class="nav-left">
          <a href="index.html" class="brand">
            <img src="https://via.placeholder.com/42" alt="Logo" class="brand-logo">
            <span>eMercado</span>
          </a>
    
          <div class="nav-links">
            <a href="index.html">Inicio</a>
            <a href="categories.html">Categorías</a>
            <a href="#">Ayuda</a>
            <a href="#">Sobre Nosotros</a>
          </div>
        </div>
    
        <div class="nav-right">
          <!-- Buscador con botón -->
          <div class="search-container" id="search-container">
            <button class="search-toggle" id="search-toggle" aria-label="Buscar">
              <span class="material-symbols-outlined">search</span>
            </button>
            <div class="search-input-wrapper" id="search-input-wrapper">
              <input type="search" id="search-input" placeholder="Buscar productos..." aria-label="Buscar productos">
            </div>
          </div>
    
          <!-- Accesibilidad -->
          <button class="icon-btn" id="accessibility-btn" title="Accesibilidad" aria-label="Opciones de accesibilidad">
            <span class="material-symbols-outlined">accessibility</span>
          </button>
    
          <!-- Modo oscuro -->
          <button class="icon-btn" id="dark-mode-btn" title="Modo oscuro" aria-label="Cambiar tema">
            <span class="material-symbols-outlined">dark_mode</span>
          </button>
    
          <!-- Favoritos -->
          <button class="icon-btn" id="fav-btn" title="Favoritos" aria-label="Favoritos">
            <span class="material-symbols-outlined" id="fav-icon">favorite_border</span>
          </button>
    
          <!-- Carrito -->
          <a href="cart.html" class="icon-btn" title="Carrito" aria-label="Carrito">
            <span class="material-symbols-outlined">shopping_cart</span>
            <span class="badge" id="cart-count">0</span>
          </a>
    
          <!-- Perfil -->
          <div style="position: relative;">
            <button class="profile-btn" id="profile-btn" aria-haspopup="true">
              <span class="material-symbols-outlined">person</span>
              <span id="user-name">Mi Perfil</span>
              <span class="material-symbols-outlined" style="font-size: 18px;">expand_more</span>
            </button>
            <ul class="profile-menu" id="profile-menu" role="menu">
              <li><a href="my-profile.html">Mi Perfil</a></li>
              <li><a href="#">Configuración</a></li>
              <li><button id="logout-btn">Cerrar sesión</button></li>
            </ul>
          </div>
        </div>
      </div>
    </nav>
    
    <!-- NAVEGACIÓN MÓVIL -->
    <nav class="nav-mobile">
      <div class="nav-mobile-top">
        <a href="index.html" class="brand">
          <img src="https://via.placeholder.com/42" alt="Logo" class="brand-logo">
          <span>eMercado</span>
        </a>
    
        <div style="display: flex; gap: 8px;">
          <button class="icon-btn" id="mobile-search-btn">
            <span class="material-symbols-outlined">search</span>
          </button>
          <button class="icon-btn">
            <span class="material-symbols-outlined">help</span>
          </button>
          <button class="icon-btn">
            <span class="material-symbols-outlined">info</span>
          </button>
        </div>
      </div>

      <!-- Mobile Search Container -->
      <div id="mobile-search-container">
        <input type="search" placeholder="Buscar productos..." aria-label="Buscar productos">
      </div>
    
      <div class="nav-mobile-bottom">
        <a href="index.html" class="icon-btn">
          <span class="material-symbols-outlined">home</span>
          Inicio
        </a>
        <a href="categories.html" class="icon-btn">
          <span class="material-symbols-outlined">category</span>
          Categorías
        </a>
        <a href="cart.html" class="icon-btn" style="position: relative;">
          <span class="material-symbols-outlined">shopping_cart</span>
          Carrito
          <span class="badge" id="mobile-cart-count" style="top: -4px; right: 8px;">0</span>
        </a>
        <button class="icon-btn" id="mobile-fav-btn">
          <span class="material-symbols-outlined" id="mobile-fav-icon">favorite_border</span>
          Favoritos
        </button>
        <button class="icon-btn" id="mobile-profile-btn">
          <span class="material-symbols-outlined">person</span>
          Perfil
        </button>
      </div>
    </nav>
  `;

  // ========== CARRITO ==========
  actualizarContadorCarrito();

  // ========== SEARCH TOGGLE (Desktop) ==========
  const searchToggle = document.getElementById("search-toggle");
  const searchInputWrapper = document.getElementById("search-input-wrapper");

  if (searchToggle && searchInputWrapper) {
    searchToggle.addEventListener("click", (e) => {
      e.stopPropagation();
      searchInputWrapper.classList.toggle("active");
    });

    document.addEventListener("click", (e) => {
      if (!searchInputWrapper.contains(e.target) && e.target !== searchToggle) {
        searchInputWrapper.classList.remove("active");
      }
    });

    searchInputWrapper.addEventListener("click", (e) => {
      e.stopPropagation();
    });
  }

  // ========== MOBILE SEARCH ==========
  const mobileSearchBtn = document.getElementById("mobile-search-btn");
  const mobileSearchContainer = document.getElementById("mobile-search-container");

  if (mobileSearchBtn && mobileSearchContainer) {
    mobileSearchBtn.addEventListener("click", () => {
      mobileSearchContainer.classList.toggle("active");
    });
  }

  // ========== PROFILE MENU (Desktop) ==========
  const profileBtn = document.getElementById("profile-btn");
  const profileMenu = document.getElementById("profile-menu");

  if (profileBtn && profileMenu) {
    profileBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      profileMenu.classList.toggle("active");
    });

    document.addEventListener("click", (e) => {
      if (!profileMenu.contains(e.target) && !profileBtn.contains(e.target)) {
        profileMenu.classList.remove("active");
      }
    });
  }

  // ========== MOBILE PROFILE ==========
  const mobileProfileBtn = document.getElementById("mobile-profile-btn");
  if (mobileProfileBtn) {
    mobileProfileBtn.addEventListener("click", () => {
      window.location.href = "my-profile.html";
    });
  }

  // ========== LOGOUT ==========
  const logoutBtn = document.getElementById("logout-btn");
  if (logoutBtn) {
    logoutBtn.addEventListener("click", () => {
      localStorage.removeItem("user");
      window.location.href = "login.html";
    });
  }

  // ========== USER NAME ==========
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const userNameElem = document.getElementById("user-name");
  if (userNameElem && user.email) {
    userNameElem.textContent = user.email.split("@")[0];
  }

  // ========== DARK MODE ==========
  const darkModeBtn = document.getElementById("dark-mode-btn");

  function updateDarkModeIcon() {
    const isDark = document.documentElement.classList.contains("dark");
    if (darkModeBtn) {
      const icon = darkModeBtn.querySelector(".material-symbols-outlined");
      if (icon) {
        icon.textContent = isDark ? "light_mode" : "dark_mode";
      }
    }
  }

  if (darkModeBtn) {
    darkModeBtn.addEventListener("click", () => {
      document.documentElement.classList.toggle("dark");
      const isDark = document.documentElement.classList.contains("dark");
      localStorage.setItem("dark", isDark);
      updateDarkModeIcon();
    });
  }

  // Actualizar icono al cargar
  updateDarkModeIcon();

  // ========== FAVORITOS ==========
  const favBtn = document.getElementById("fav-btn");
  const mobileFavBtn = document.getElementById("mobile-fav-btn");
  const favIcon = document.getElementById("fav-icon");
  const mobileFavIcon = document.getElementById("mobile-fav-icon");

  function toggleFavorito() {
    const isFav = favIcon && favIcon.textContent === "favorite";
    const newIcon = isFav ? "favorite_border" : "favorite";
    if (favIcon) favIcon.textContent = newIcon;
    if (mobileFavIcon) mobileFavIcon.textContent = newIcon;
  }

  if (favBtn) favBtn.addEventListener("click", toggleFavorito);
  if (mobileFavBtn) mobileFavBtn.addEventListener("click", toggleFavorito);

  // ========== ACCESSIBILITY ==========
  const accessibilityBtn = document.getElementById("accessibility-btn");
  if (accessibilityBtn) {
    accessibilityBtn.addEventListener("click", () => {
      alert("Panel de accesibilidad - Funcionalidad por implementar");
    });
  }
});

// ========== FUNCIÓN PARA ACTUALIZAR CONTADOR ==========
function actualizarContadorCarrito() {
  const productos = JSON.parse(localStorage.getItem("cart") || "[]");
  const count = productos.length;

  const cartCount = document.getElementById("cart-count");
  const mobileCartCount = document.getElementById("mobile-cart-count");

  if (cartCount) {
    cartCount.textContent = count;
    cartCount.style.display = count > 0 ? "flex" : "none";
  }

  if (mobileCartCount) {
    mobileCartCount.textContent = count;
    mobileCartCount.style.display = count > 0 ? "flex" : "none";
  }
}

// Exportar función
if (typeof window !== 'undefined') {
  window.actualizarContadorCarrito = actualizarContadorCarrito;
}