// ==================== init.js - VERSIÓN CON AUTENTICACIÓN ====================
const CATEGORIES_URL = "http://localhost:3000/cats";
const PRODUCTS_URL = "http://localhost:3000/products/category/";
const PRODUCT_INFO_URL = "http://localhost:3000/products/";
const CART_INFO_URL = "https://japceibal.github.io/emercado-api/user_cart/";
const CART_BUY_URL = "https://japceibal.github.io/emercado-api/cart/buy.json";
const PRODUCT_INFO_COMMENTS_URL = "https://japceibal.github.io/emercado-api/products_comments/";
const PUBLISH_PRODUCT_URL = "https://japceibal.github.io/emercado-api/sell/publish.json";
const EXT_TYPE = ".json";

// ==================== SPINNER ====================
let showSpinner = function () {
  document.getElementById("spinner-wrapper")?.style = "block";
}

let hideSpinner = function () {
  document.getElementById("spinner-wrapper")?.style = "none";
}

// ==================== FUNCIÓN UNIVERSAL CON TOKEN ====================
window.api = async function (endpoint, options = {}) {
  const token = localStorage.getItem("token");

  // Si intenta acceder a una ruta protegida sin token → login
  if (!token && !["/login.html", "/registro.html"].includes(location.pathname.split("/").pop())) {
    window.location.href = "login.html";
    return new Promise(() => {});
  }

  return fetch(`http://localhost:3000${endpoint}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`,
      ...options.headers
    }
  })
  .then(res => {
    if (res.status === 401) {
      // Token inválido o expirado
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      alert("Sesión expirada. Por favor, inicia sesión nuevamente.");
      window.location.href = "login.html";
      throw new Error("No autorizado");
    }
    return res;
  });
}

// ==================== getJSONData ====================
let getJSONData = async function (url) {
  let result = {};
  showSpinner();
  try {
    const response = await fetch(url);
    if (response.ok) {
      result.status = 'ok';
      result.data = await response.json();
    } else {
      throw Error(response.statusText);
    }
  } catch (error) {
    result.status = 'error';
    result.data = error;
  }
  hideSpinner();
  return result;
}

// ==================== REDIRECCIÓN SI NO ESTÁ LOGUEADO ====================
document.addEventListener("DOMContentLoaded", () => {
  const token = localStorage.getItem("token");
  const paginaActual = location.pathname.split("/").pop();

  // Si está en index.html y no tiene token → Pal Loby
  if (!token && paginaActual === "index.html") {
    window.location.href = "login.html";
  }
});