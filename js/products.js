let allProducts = [];
let currentProducts = [];

// ---- Render con estilo Tailwind ----
function showProductsList(lista) {
  const cont = document.getElementById("product-list-container");
  if (!cont) return;

  let html = "";

  if (lista.length === 0) {
    html = `
            <div class="col-span-full text-center py-16">
                <span class="material-symbols-outlined text-6xl text-accent/40 dark:text-muted-dark mb-4">search_off</span>
                <p class="text-xl text-accent/70 dark:text-muted-dark">No hay productos que coincidan con los filtros.</p>
            </div>
        `;
  } else {
    for (const p of lista) {
      // Determinar badge de condición
      let conditionBadge = '';
      if (p.condition === 'nuevo' || !p.condition) {
        conditionBadge = '<div class="absolute top-2 right-2 bg-primary text-accent text-xs font-bold px-2 py-1 rounded">Nuevo</div>';
      } else if (p.condition === 'reacondicionado') {
        conditionBadge = '<div class="absolute top-2 right-2 bg-green-100 text-green-800 dark:bg-green-500/20 dark:text-green-400 text-xs font-bold px-2 py-1 rounded">Reacondicionado</div>';
      } else if (p.condition === 'usado') {
        conditionBadge = '<div class="absolute top-2 right-2 bg-yellow-100 text-yellow-800 dark:bg-yellow-500/20 dark:text-yellow-400 text-xs font-bold px-2 py-1 rounded">Usado</div>';
      }

      html += `
                <div class="bg-surface-light dark:bg-surface-dark rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-shadow duration-300 group cursor-pointer border border-primary/10 dark:border-transparent" id="product-${p.id}">
                    <div class="relative">
                        <div class="w-full aspect-[4/3] bg-cover bg-center" style="background-image: url('${p.image}');"></div>
                        ${conditionBadge}
                    </div>
                    <div class="p-4">
                        <h3 class="font-bold text-lg mb-1 text-accent dark:text-contrast-dark">${p.name}</h3>
                        <p class="text-sm text-accent/60 dark:text-muted-dark mb-3 h-10 line-clamp-2">
                            ${p.description}
                        </p>
                        <div class="flex justify-between items-center mb-4">
                            <p class="text-xl font-extrabold text-accent dark:text-primary">${p.currency} ${p.cost}</p>
                            <p class="text-sm text-accent/60 dark:text-muted-dark">${p.soldCount} vendidos</p>
                        </div>
                    </div>
                </div>
            `;
    }
  }

  cont.innerHTML = html;

  // Asignar evento click a cada producto
  lista.forEach(p => {
    const prodEl = document.getElementById(`product-${p.id}`);
    if (prodEl) {
      prodEl.addEventListener("click", () => {
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
  const minEl = getEl("precio-min");
  const maxEl = getEl("precio-max");
  const entregaEl = getEl("entrega");
  const stockEl = getEl("stock");

  const min = minEl && minEl.value.trim() !== "" ? parseFloat(minEl.value) : null;
  const max = maxEl && maxEl.value.trim() !== "" ? parseFloat(maxEl.value) : null;

  // Obtener el valor actual del ordenamiento desde el botón
  const ordenarBtn = getEl("btn-ordenar");
  let orden = "relevancia";
  if (ordenarBtn && ordenarBtn.dataset.value) {
    orden = ordenarBtn.dataset.value;
  }

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

  // Filtro de Precio
  if (f.min != null && !isNaN(f.min)) lista = lista.filter(p => Number(p.cost) >= f.min);
  if (f.max != null && !isNaN(f.max)) lista = lista.filter(p => Number(p.cost) <= f.max);

  // Ordenamiento
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
  const ids = ["precio-min", "precio-max", "entrega", "buscador"];
  ids.forEach(id => {
    const el = getEl(id);
    if (el) el.value = "";
  });

  const stockEl = getEl("stock");
  if (stockEl) stockEl.checked = false;

  // Resetear checkboxes de condición
  ["cond-nuevo", "cond-reacond", "cond-usado"].forEach(id => {
    const el = getEl(id);
    if (el) el.checked = false;
  });

  // Resetear ordenamiento
  const ordenarBtn = getEl("btn-ordenar");
  const ordenarText = getEl("ordenar-text");
  if (ordenarBtn) ordenarBtn.dataset.value = "relevancia";
  if (ordenarText) ordenarText.textContent = "Ordenar por: Relevancia";

  currentProducts = filterAndSort(allProducts, {
    min: null,
    max: null,
    entrega: "",
    stock: false,
    orden: "relevancia"
  });
  showProductsList(currentProducts);
}

// ---- Manejo de Dropdowns ----
function setupDropdowns() {
  const dropdowns = [
    { btn: "btn-condicion", menu: "dropdown-condicion" },
    { btn: "btn-precio", menu: "dropdown-precio" },
    { btn: "btn-entrega", menu: "dropdown-entrega" },
    { btn: "btn-ordenar", menu: "dropdown-ordenar" }
  ];

  dropdowns.forEach(({ btn, menu }) => {
    const btnEl = getEl(btn);
    const menuEl = getEl(menu);

    if (btnEl && menuEl) {
      btnEl.addEventListener("click", (e) => {
        e.stopPropagation();

        // Cerrar otros dropdowns
        dropdowns.forEach(({ menu: otherMenu }) => {
          if (otherMenu !== menu) {
            const otherMenuEl = getEl(otherMenu);
            if (otherMenuEl) otherMenuEl.classList.add("hidden");
          }
        });

        menuEl.classList.toggle("hidden");
      });
    }
  });

  // Cerrar dropdowns al hacer click fuera
  document.addEventListener("click", () => {
    dropdowns.forEach(({ menu }) => {
      const menuEl = getEl(menu);
      if (menuEl) menuEl.classList.add("hidden");
    });
  });

  // Prevenir que clicks dentro del dropdown lo cierren
  dropdowns.forEach(({ menu }) => {
    const menuEl = getEl(menu);
    if (menuEl) {
      menuEl.addEventListener("click", (e) => {
        e.stopPropagation();
      });
    }
  });
}

// ---- Manejo del dropdown de Ordenar ----
function setupOrdenarDropdown() {
  const dropdownOrdenar = getEl("dropdown-ordenar");
  const ordenarText = getEl("ordenar-text");
  const ordenarBtn = getEl("btn-ordenar");

  if (dropdownOrdenar && ordenarText && ordenarBtn) {
    const options = dropdownOrdenar.querySelectorAll("button[data-value]");

    options.forEach(option => {
      option.addEventListener("click", () => {
        const value = option.dataset.value;
        const text = option.textContent.trim();

        ordenarText.textContent = `Ordenar por: ${text}`;
        ordenarBtn.dataset.value = value;

        dropdownOrdenar.classList.add("hidden");

        // Aplicar filtros automáticamente
        aplicarFiltros();
      });
    });
  }
}

// ---- Inicio ----
document.addEventListener("DOMContentLoaded", function () {
  // Configurar dropdowns
  setupDropdowns();
  setupOrdenarDropdown();

  const catID = localStorage.getItem("catID");
  const url = catID
    ? PRODUCTS_URL + catID
    : PRODUCTS_URL + "101";

  getJSONData(url).then(function (resultObj) {
    if (resultObj.status === "ok") {
      allProducts = resultObj.data.products || [];

      // Actualizar título y descripción de la categoría
      const categoryTitle = getEl("category-title");
      const categoryDesc = getEl("category-description");
      if (categoryTitle && resultObj.data.catName) {
        categoryTitle.textContent = resultObj.data.catName;
      }

      // Primera carga: mostrar por relevancia
      currentProducts = filterAndSort(allProducts, {
        min: null,
        max: null,
        entrega: "",
        stock: false,
        orden: "relevancia"
      });
      showProductsList(currentProducts);
    }
  });

  // ---- FILTRO BUSCADOR ----
  const buscadorEl = getEl("buscador");
  if (buscadorEl) {
    buscadorEl.addEventListener("input", function () {
      const texto = buscadorEl.value.toLowerCase();

      const filtrados = currentProducts.filter(p =>
        (p.name && p.name.toLowerCase().includes(texto)) ||
        (p.description && p.description.toLowerCase().includes(texto))
      );

      showProductsList(filtrados);
    });
  }
      showProductsList(filtrados);
    });
  }

  // Botones
  const btnAplicar = getEl("aplicar-filtros");
  if (btnAplicar) btnAplicar.addEventListener("click", aplicarFiltros);
  // Botones
  const btnAplicar = getEl("aplicar-filtros");
  if (btnAplicar) btnAplicar.addEventListener("click", aplicarFiltros);

  const btnLimpiar = getEl("limpiar-filtros");
  if (btnLimpiar) btnLimpiar.addEventListener("click", limpiarFiltros);
  const btnLimpiar = getEl("limpiar-filtros");
  if (btnLimpiar) btnLimpiar.addEventListener("click", limpiarFiltros);

  // Aplicar filtros al presionar Enter en campos de precio
  const minEl = getEl("precio-min");
  const maxEl = getEl("precio-max");
  [minEl, maxEl].forEach(el => {
    if (!el) return;
    el.addEventListener("keydown", e => {
      if (e.key === "Enter") {
        aplicarFiltros();
        // Cerrar el dropdown de precio
        const dropdownPrecio = getEl("dropdown-precio");
        if (dropdownPrecio) dropdownPrecio.classList.add("hidden");
      }
    });
  });

  // Aplicar filtros al cambiar entrega
  const entregaEl = getEl("entrega");
  if (entregaEl) {
    entregaEl.addEventListener("change", () => {
      aplicarFiltros();
      const dropdownEntrega = getEl("dropdown-entrega");
      if (dropdownEntrega) dropdownEntrega.classList.add("hidden");
    });
  }

  // Aplicar filtros al cambiar stock
  const stockEl = getEl("stock");
  if (stockEl) {
    stockEl.addEventListener("change", aplicarFiltros);
  }

  // Aplicar filtros al cambiar condición
  ["cond-nuevo", "cond-reacond", "cond-usado"].forEach(id => {
    const el = getEl(id);
    if (el) {
      el.addEventListener("change", aplicarFiltros);
    }
  });
});