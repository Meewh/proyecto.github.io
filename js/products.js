
let products = [];
let allProducts = [];      // para los filtros
let currentProducts = [];  // lo que se muestra en pantalla

// ==================== PROTECCIÓN DE RUTA ====================
const token = localStorage.getItem("token");

if (!token) {
  const paginaActual = location.pathname.split("/").pop();
  if (!["login.html", "registro.html"].includes(paginaActual)) {
    window.location.href = "login.html";
  }
}
// ==============================================================

// ---- Render ----
function showProductsList(lista) {
  const cont = document.getElementById("product-list-container");
  if (!cont) return;

  let html = "";
  for (const p of lista) {
    html += `
      <div class="col-12 col-sm-6 col-md-4 mb-4">
        <div class="product-card" id="product-${p.id}" style="cursor:pointer;">
          <img src="${p.images[0]}" alt="Producto" class="product-image">
          <h5 class="fw-bold">${p.name}</h5>
          <p class="text-muted">${p.description}</p>
          <p class="price">${p.currency} ${p.cost}</p>
          <p class="sold">${p.soldcount} vendidos</p>
        </div>
      </div>`;
  }
  cont.innerHTML = html || `<p class="text-muted">No hay productos que coincidan con los filtros.</p>`;

  // ---- Asignar evento click a cada producto ----
  lista.forEach(p => {
    const prodEl = document.getElementById(`product-${p.id}`);
    if (prodEl) {
      prodEl.addEventListener("click", () => {
        localStorage.setItem("producto", p.id); // Guardar id en localStorage
        window.location.href = "product-info.html"; // Redirigir a otra página
      });
    }
  });
}

// ---- Helpers ----
function getEl(id) {
  return document.getElementById(id);
}

function getFilters() {
  // Si algún control no existe en el HTML, devolvemos valores seguros.
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

function filterAndSort(baseList, f) {
  let lista = baseList.slice();

  // Precio
  if (f.min != null && !isNaN(f.min)) lista = lista.filter(p => Number(p.cost) >= f.min);
  if (f.max != null && !isNaN(f.max)) lista = lista.filter(p => Number(p.cost) <= f.max);

  // NOTA: entrega/stock/condición se omiten si no existen en el JSON

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
      // Más vendidos primero
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

  // Mostrar por relevancia al limpiar
  currentProducts = filterAndSort(allProducts, { min: null, max: null, entrega: "", stock: false, orden: "relevancia" });
  showProductsList(currentProducts);
}

const dropdownItems = document.querySelectorAll('.dropdown-item');
const dropdownButton = document.getElementById('dropdownButton');

dropdownItems.forEach(item => {
  item.addEventListener('click', function (e) {
    e.preventDefault(); // evita que el enlace navegue
    dropdownButton.textContent = this.textContent;
  });
});

// ==================== CARGA DE PRODUCTOS CON TOKEN ====================
document.addEventListener("DOMContentLoaded", function () {

  const catID = localStorage.getItem("catID") || "101";
  const url = `http://localhost:3000/products/category/${catID}`;

  fetch(url, {
    headers: {
      "Authorization": `Bearer ${token}`
    }
  })
  .then(res => {
    if (res.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.href = "login.html";
    }
    return res.json();
  })
  .then(data => {
    // La respuesta del backend es: { catID, catName, products: [...] }
    allProducts = data.products || [];
    currentProducts = filterAndSort(allProducts, { min: null, max: null, entrega: "", stock: false, orden: "relevancia" });
    showProductsList(currentProducts);
  })
  .catch(err => console.error("Error cargando productos:", err));

  // ---- FILTRO BUSCADOR ----
  const buscadorEl = getEl("buscador");
  if (buscadorEl) {
    buscadorEl.addEventListener("input", function () {
      const texto = buscadorEl.value.toLowerCase();

      // filtramos desde allProducts para no perder productos al escribir y borrar
      const filtrados = currentProducts.filter(p => // tomamos en cuenta los ''currentProducts'' para que se aplique los filtros elegidos
        (p.name && p.name.toLowerCase().includes(texto)) ||
        (p.description && p.description.toLowerCase().includes(texto))
      );

      showProductsList(filtrados);
    });
  }

  // Botones
  const btnAplicar = getEl("aplicar-filtros");
  if (btnAplicar) btnAplicar.addEventListener("click", aplicarFiltros);

  const btnLimpiar = getEl("limpiar-filtros");
  if (btnLimpiar) btnLimpiar.addEventListener("click", limpiarFiltros);

  // Aplicar automáticamente al cambiar el orden o escribir min/max (Enter)
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