// ---- Variables globales ----
let products = [];
let allProducts = [];      // necesario para filtros
let currentProducts = [];  // necesario para filtros y buscador

// ============================================================
// NUEVAS LÍNEAS ENTREGA 8: FUNCIÓN fetchConToken REUTILIZABLE
// ============================================================
async function fetchConToken(url) {
    const token = localStorage.getItem("token");
    const response = await fetch(url, {
        headers: token ? { "Authorization": `Bearer ${token}` } : {}
    });
    
    if (!response.ok) {
        if (response.status === 401) {
            alert("Tu sesión expiró. Volvé a iniciar sesión.");
            window.location.href = "login.html";
        }
        throw new Error("Error HTTP: " + response.status);
    }
    return await response.json();
}
// ============================================================
// FIN NUEVAS LÍNEAS ENTREGA 8
// ============================================================



// ---- Render ----
function showProductsList(lista) {
  const cont = document.getElementById("product-list-container");
  if (!cont) return;

  let html = "";
  for (const p of lista) {
    html += `
      <div class="col-12 col-sm-6 col-md-4 mb-4">
        <div class="product-card" id="product-${p.id}" style="cursor:pointer;">
          <img src="${p.image}" alt="Producto" class="product-image">
          <h5 class="fw-bold">${p.name}</h5>
          <p class="text-muted">${p.description}</p>
          <p class="price">${p.currency} ${p.cost}</p>
          <p class="sold">${p.soldCount} vendidos</p>
        </div>
      </div>`;
  }
  cont.innerHTML = html || `<p class="text-muted">No hay productos que coincidan con los filtros.</p>`;

  // ---- Asignar evento click a cada producto ----
  lista.forEach(p => {
    const prodEl = document.getElementById(`product-${p.id}`);
    if (prodEl) {
      prodEl.addEventListener("click", () => {
        // 🔥 FIX: usar la misma clave que espera product-info.js ("producto")
        localStorage.setItem("producto", p.id);
        window.location.href = "product-info.html";
      });
    }
  });
}



// ---- Helpers ----
function getEl(id) {
  return document.getElementById(id);
}

function getFilters() {
  {
  const minEl = getEl("precio-min");
  const maxEl = getEl("precio-max");
  const orderEl = getEl("ordenar");
  const entregaEl = getEl("entrega");
  const stockEl = getEl("stock");

  const min = minEl && minEl.value.trim() !== "" ? parseFloat(minEl.value) : null;
  const max = maxEl && maxEl.value.trim() !== "" ? parseFloat(maxEl.value) : null;

  let orden = "relevancia";
  if (orderEl && orderEl.value) orden = orderEl.value;

  return {
    min,
    max,
    entrega: entregaEl ? entregaEl.value : "",
    stock: stockEl ? stockEl.checked : false,
    orden
  };
}
}

function filterAndSort(baseList, f) {
  let lista = baseList.slice();

  if (f.min != null && !isNaN(f.min)) lista = lista.filter(p => Number(p.cost) >= f.min);
  if (f.max != null && !isNaN(f.max)) lista = lista.filter(p => Number(p.cost) <= f.max);

  switch (f.orden) {
    case "precio-asc":
      lista.sort((a, b) => Number(a.cost) - Number(b.cost));
      break;
    case "precio-desc":
      lista.sort((a, b) => Number(b.cost) - Number(a.cost));
      break;
    case "nombre-asc":
      lista.sort((a, b) => (a.name || "").localeCompare(b.name || "", "es", { sensitivity: "base" }));
      break;
    case "nombre-desc":
      lista.sort((a, b) => (b.name || "").localeCompare(a.name || "", "es", { sensitivity: "base" }));
      break;
    case "relevancia":
    default:
      lista.sort((a, b) => Number(b.soldCount || 0) - Number(a.soldCount || 0));
      break;
  }

  return lista;
}



// ---- Acciones ----
function aplicarFiltros() {
  const f = getFilters();

  if (f.min != null && f.max != null && f.min > f.max) {
    const tmp = f.min;
    f.min = f.max;
    f.max = tmp;
  }

  currentProducts = filterAndSort(allProducts, f);
  showProductsList(currentProducts);
}

function limpiarFiltros() {
  const ids = ["precio-min", "precio-max", "entrega"];
  ids.forEach(id => { const el = getEl(id); if (el) el.value = ""; });

  const orderEl = getEl("ordenar");
  if (orderEl) orderEl.value = "relevancia";

  const stockEl = getEl("stock");
  if (stockEl) stockEl.checked = false;

  currentProducts = filterAndSort(allProducts, { min: null, max: null, entrega: "", stock: false, orden: "relevancia" });
  showProductsList(currentProducts);
}

const dropdownItems = document.querySelectorAll('.dropdown-item');
const dropdownButton = document.getElementById('dropdownButton');

dropdownItems.forEach(item => {
  item.addEventListener('click', function (e) {
    e.preventDefault();
    dropdownButton.textContent = this.textContent;
  });
});



// ---- Inicio ----
document.addEventListener("DOMContentLoaded", async function () {

  // Forzamos categoría 101 (Autos) si no hay nada en localStorage
  const catID = localStorage.getItem("catID") || "101";

  // 🔥 FIX GRANDE: el backend usa ?cat= NO ?category=
  const url = `http://localhost:3000/products?cat=${catID}`;

  console.log("Intentando cargar productos...");
  console.log("Categoría seleccionada:", catID);
  console.log("URL:", url);

  try {
    const resultObj = await fetchConToken(url);

    // DEBUG: vemos exactamente qué nos devuelve el backend
    console.log("Respuesta completa del backend:", resultObj);

    // CORRECCIÓN: Backend devuelve { products: [...] }, así que usamos resultObj.products
    let productos = [];

    if (resultObj && Array.isArray(resultObj.products)) {
      productos = resultObj.products;
    } else if (Array.isArray(resultObj)) {
      productos = resultObj;
    } else if (resultObj && resultObj.data && Array.isArray(resultObj.data)) {
      productos = resultObj.data;
    } else {
      throw new Error("Formato inesperado del backend");
    }

    allProducts = productos;

    console.log("Productos procesados:", allProducts.length, allProducts);

    if (allProducts.length === 0) {
      document.getElementById("product-list-container").innerHTML = `
        <p class="text-center text-muted fs-4">No hay productos en esta categoría (cat=${catID})</p>
        <small class="text-danger d-block">Revisá la consola (F12) y pegame lo que dice arriba</small>`;
      return;
    }

    // Si llegamos acá → ¡TENEMOS PRODUCTOS!
    currentProducts = filterAndSort(allProducts, { min: null, max: null, entrega: "", stock: false, orden: "relevancia" });
    showProductsList(currentProducts);

  } catch (err) {
    console.error("Error completo:", err);
    document.getElementById("product-list-container").innerHTML = `
      <p class="text-danger text-center">Error de conexión o token inválido.<br>
      Hacé login de nuevo.</p>`;
  }

  // ---- FILTRO BUSCADOR ----
  const buscadorEl = getEl("buscador");
  if (buscadorEl) {
    buscadorEl.addEventListener("input", function () {
      const texto = buscadorEl.value.toLowerCase();
      const filtrados = allProducts.filter(p => 
        (p.name && p.name.toLowerCase().includes(texto)) ||
        (p.description && p.description.toLowerCase().includes(texto))
      );
      showProductsList(filtrados);
    });
  }

  // Botones y filtros
  const btnAplicar = getEl("aplicar-filtros");
  if (btnAplicar) btnAplicar.addEventListener("click", aplicarFiltros);

  const btnLimpiar = getEl("limpiar-filtros");
  if (btnLimpiar) btnLimpiar.addEventListener("click", limpiarFiltros);

  const orderEl = getEl("ordenar");
  if (orderEl) orderEl.addEventListener("change", aplicarFiltros);

  const minEl = getEl("precio-min");
  const maxEl = getEl("precio-max");
  [minEl, maxEl].forEach(el => {
    if (!el) return;
    el.addEventListener("keydown", e => { if (e.key === "Enter") aplicarFiltros(); });
    el.addEventListener("blur", aplicarFiltros);
  });
});
