// products.js - versión corregida y completa
let allProducts = [];
let currentProducts = [];

// ---- Render ----
function showProductsList(lista) {
  const cont = document.getElementById("product-list-container");
  if (!cont) return;

  cont.innerHTML = "";

  for (const p of lista) {
    const col = document.createElement("div");
    col.className = "col-md-4 mb-4";

    const card = document.createElement("div");
    card.className = "product-card";
    // usa el nombre como alt para accesibilidad
    const imageSrc = p.image || p.images?.[0] || "img/no-image.png";

    card.innerHTML = `
      <img src="${imageSrc}" alt="${(p.name || 'Producto')}" class="product-image">
      <h5 class="fw-bold">${p.name || ''}</h5>
      <p class="text-muted">${p.description || ''}</p>
      <p class="price">${p.currency || ''} ${p.cost != null ? p.cost : ''}</p>
      <p class="sold">${p.soldCount != null ? p.soldCount : 0} vendidos</p>
    `;

    // accesibilidad: rol botón y tabindex
    card.setAttribute("role", "button");
    card.tabIndex = 0;

    const goToProduct = () => {
      try {
        localStorage.setItem("productID", p.id);
        localStorage.setItem("catID", catID);             // <--- guardamos la categoría
        localStorage.setItem("productImg", p.images?.[0] || p.image || ""); // <--- guardamos la imagen principal
      } catch (e) {
        console.warn("No se pudo guardar productID/catID/productImg en localStorage:", e);
      }
      window.location.href = "product-info.html";
};


    card.style.cursor = "pointer";
    card.addEventListener("click", goToProduct);
    card.addEventListener("keydown", (e) => { if (e.key === "Enter") goToProduct(); });

    col.appendChild(card);
    cont.appendChild(col);
  }

  if (lista.length === 0) {
    cont.innerHTML = `<p class="text-muted">No hay productos que coincidan con los filtros.</p>`;
  }
}

// ---- Helpers ----
function getEl(id) {
  return document.getElementById(id);
}

function getFilters() {
  const minEl = getEl("precio-min");
  const maxEl = getEl("precio-max");
  const orderEl = getEl("ordenar");
  const entregaEl = getEl("entrega");
  const stockEl = getEl("stock");

  const condNuevo = getEl("cond-nuevo");
  const condReacond = getEl("cond-reacond");
  const condUsado = getEl("cond-usado");

  const min = minEl && String(minEl.value).trim() !== "" ? parseFloat(minEl.value) : null;
  const max = maxEl && String(maxEl.value).trim() !== "" ? parseFloat(maxEl.value) : null;

  const conditions = [];
  if (condNuevo && condNuevo.checked) conditions.push("nuevo");
  if (condReacond && condReacond.checked) conditions.push("reacondicionado");
  if (condUsado && condUsado.checked) conditions.push("usado");

  return {
    min,
    max,
    entrega: entregaEl ? entregaEl.value : "",
    stock: stockEl ? stockEl.checked : false,
    orden: orderEl ? orderEl.value : "relevancia",
    conditions
  };
}

function filterAndSort(baseList, f) {
  let lista = baseList.slice();

  // Precio (asegurar que cost se convierta a número)
  if (f.min != null && !isNaN(f.min)) lista = lista.filter(p => Number(p.cost) >= f.min);
  if (f.max != null && !isNaN(f.max)) lista = lista.filter(p => Number(p.cost) <= f.max);

  // Condición (si el usuario seleccionó alguna)
  if (f.conditions && f.conditions.length > 0) {
    lista = lista.filter(p => {
      const val = ((p.condition || p.conditionType || p.condition_name || "") + "").toLowerCase();
      if (!val) return false; // si no hay dato, lo excluimos al filtrar por condición
      return f.conditions.includes(val);
    });
  }

  // Stock
  if (f.stock) {
    lista = lista.filter(p => {
      if (typeof p.available !== "undefined") return Boolean(p.available);
      if (typeof p.inStock !== "undefined") return Boolean(p.inStock);
      if (typeof p.stock !== "undefined") return Number(p.stock) > 0;
      // si no hay info de stock, lo dejamos pasar (cambia a false si preferís excluir desconocidos)
      return true;
    });
  }

  // Tiempo de entrega (intentar extraer horas de campos comunes)
  if (f.entrega) {
    const maxHours = parseInt(f.entrega, 10);
    if (!isNaN(maxHours)) {
      lista = lista.filter(p => {
        const keys = ["deliveryTime", "shippingTime", "estimatedDelivery", "delivery", "envio", "shipping"];
        for (const k of keys) {
          if (p[k]) {
            const m = String(p[k]).match(/(\d+)/);
            if (m && parseInt(m[1], 10) <= maxHours) return true;
            if (m) return false;
          }
        }
        // si no tiene info de entrega, lo dejamos pasar
        return true;
      });
    }
  }

  // Orden
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

  // Si el usuario puso min > max, los invertimos para evitar “no hay resultados”
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

  // Limpiar condiciones
  ["cond-nuevo", "cond-reacond", "cond-usado"].forEach(id => {
    const el = getEl(id);
    if (el) el.checked = false;
  });

  // Mostrar por relevancia al limpiar
  currentProducts = filterAndSort(allProducts, { min: null, max: null, entrega: "", stock: false, orden: "relevancia", conditions: [] });
  showProductsList(currentProducts);
}

// ---- Inicio ----
document.addEventListener("DOMContentLoaded", function () {
  // si init.js define showSpinner/hideSpinner, los usamos; si no, no romperá
  if (typeof showSpinner === "function") showSpinner();

  const catID = localStorage.getItem("catID");
  const url = catID
    ? `https://japceibal.github.io/emercado-api/cats_products/${catID}.json`
    : `https://japceibal.github.io/emercado-api/cats_products/101.json`;

  getJSONData(url).then(function (resultObj) {
    if (resultObj.status === "ok") {
      allProducts = resultObj.data.products || [];
      // Primera carga: mostrar por relevancia
      currentProducts = filterAndSort(allProducts, { min: null, max: null, entrega: "", stock: false, orden: "relevancia", conditions: [] });
      showProductsList(currentProducts);
    } else {
      const cont = getEl("product-list-container");
      if (cont) cont.innerHTML = `<p class="text-danger">Error cargando productos.</p>`;
    }
  }).catch((err) => {
    console.error("Error al obtener productos:", err);
    const cont = getEl("product-list-container");
    if (cont) cont.innerHTML = `<p class="text-danger">Error cargando productos.</p>`;
  }).finally(() => {
    if (typeof hideSpinner === "function") hideSpinner();
  });

  // Botones
  const btnAplicar = getEl("aplicar-filtros");
  if (btnAplicar) btnAplicar.addEventListener("click", aplicarFiltros);

  const btnLimpiar = getEl("limpiar-filtros");
  if (btnLimpiar) btnLimpiar.addEventListener("click", limpiarFiltros);

  // Aplicar automáticamente al cambiar el orden o escribir min/max (Enter) o blur
  const orderEl = getEl("ordenar");
  if (orderEl) orderEl.addEventListener("change", aplicarFiltros);

  const minEl = getEl("precio-min");
  const maxEl = getEl("precio-max");
  [minEl, maxEl].forEach(el => {
    if (!el) return;
    el.addEventListener("keydown", e => { if (e.key === "Enter") aplicarFiltros(); });
    el.addEventListener("blur", aplicarFiltros);
  });

  // Aplicar automáticamente al cambiar los checkboxes o selects relacionados
  ["cond-nuevo", "cond-reacond", "cond-usado", "stock", "entrega"].forEach(id => {
    const el = getEl(id);
    if (el) el.addEventListener("change", aplicarFiltros);
  });
});