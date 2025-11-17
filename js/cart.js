// ============================================================
// VARIABLES GLOBALES
// ============================================================
let tasaUSDToUYU = null;
const TASA_FALLBACK_UYU_USD = 43;

let descuentoAplicado = 0;
let costoEnvioPorcentaje = 0.05;
let direccionGuardada = JSON.parse(localStorage.getItem("direccionPredeterminada")) || null;

let metodoSeleccionado = null;

// ============================================================
// DOMContentLoaded
// ============================================================
document.addEventListener("DOMContentLoaded", function () {
  cargarTasaYActualizar();
  inicializarEventos();
  verificarBotonPagar();

  if (direccionGuardada) {
    rellenarFormularioDireccion(direccionGuardada);
    mostrarOpcionesEnvio();
    mostrarCheckDireccion();
    verificarBotonPagar();
    // Abrir automáticamente si hay dirección guardada
    const addressContent = document.getElementById("address-content");
    const addressIcon = document.getElementById("address-icon");
    if (addressContent) addressContent.classList.remove("hidden");
    if (addressIcon) addressIcon.style.transform = "rotate(180deg)";
  }
});

// ============================================================
// INICIALIZAR EVENTOS
// ============================================================
function inicializarEventos() {
  document.getElementById("apply-coupon").addEventListener("click", aplicarCupon);
  document.getElementById("shipping-form").addEventListener("submit", manejarEnvio);

  document.querySelectorAll('input[name="shipping"]').forEach(radio => {
    radio.addEventListener("change", () => {
      costoEnvioPorcentaje = parseFloat(radio.value);
      actualizarSubtotal();
      verificarBotonPagar();
    });
  });

  // Modal
  document.getElementById("checkout-button").addEventListener("click", abrirModal);
  document.getElementById("close-modal").addEventListener("click", cerrarModal);
  document.getElementById("cancel-payment").addEventListener("click", cerrarModal);
  document.getElementById("payment-modal-backdrop").addEventListener("click", (e) => {
    if (e.target.id === "payment-modal-backdrop") cerrarModal();
  });

  document.querySelectorAll('input[name="payment"]').forEach(radio => {
    radio.addEventListener("change", () => mostrarFormularioPago(radio.value));
  });

  document.getElementById("confirm-payment").addEventListener("click", confirmarPago);

  // Toggle dirección
  const addressToggle = document.getElementById("address-toggle");
  const addressContent = document.getElementById("address-content");
  const addressIcon = document.getElementById("address-icon");

  if (addressToggle && addressContent && addressIcon) {
    addressToggle.addEventListener("click", () => {
      const isHidden = addressContent.classList.contains("hidden");

      if (isHidden) {
        addressContent.classList.remove("hidden");
        addressIcon.style.transform = "rotate(180deg)";
      } else {
        addressContent.classList.add("hidden");
        addressIcon.style.transform = "rotate(0deg)";
      }
    });
  }

  // Inicializar formulario de pago por defecto
  mostrarFormularioPago("redes");
}

// ============================================================
// MODAL
// ============================================================
function abrirModal() {
  document.getElementById("payment-modal-backdrop").classList.remove("hidden");
  document.body.style.overflow = "hidden";
}

function cerrarModal() {
  document.getElementById("payment-modal-backdrop").classList.add("hidden");
  document.body.style.overflow = "";
}

// ============================================================
// TASA DE CAMBIO
// ============================================================
async function obtenerTasaUSDToUYU() {
  const cache = JSON.parse(localStorage.getItem("exchangeRateCache") || "{}");
  const ahora = Date.now();
  if (cache.timestamp && (ahora - cache.timestamp) < 3600000) return cache.tasa;

  try {
    const response = await fetch("https://api.exchangerate-api.com/v4/latest/USD");
    if (!response.ok) throw new Error("API no disponible");
    const data = await response.json();
    const tasa = data.rates.UYU;
    localStorage.setItem("exchangeRateCache", JSON.stringify({ tasa, timestamp: ahora }));
    return tasa;
  } catch (error) {
    console.warn("Error al obtener tasa:", error.message);
    localStorage.setItem("exchangeRateCache", JSON.stringify({ tasa: TASA_FALLBACK_UYU_USD, timestamp: ahora }));
    return TASA_FALLBACK_UYU_USD;
  }
}

async function cargarTasaYActualizar() {
  tasaUSDToUYU = await obtenerTasaUSDToUYU();
  dibujarProductos();
  actualizarSubtotal();
}

// ============================================================
// SUBTOTAL
// ============================================================
async function actualizarSubtotal() {
  const subtotalElem = document.getElementById("subtotal");
  const shippingCostElem = document.getElementById("shipping-cost");
  const cart = JSON.parse(localStorage.getItem("cart")) || [];

  if (cart.length === 0) {
    subtotalElem.innerHTML = `
      <p class="text-sm mb-1 text-text-light-secondary dark:text-text-dark-secondary">Subtotal</p>
      <p class="text-2xl font-bold text-accent dark:text-text-dark-primary">UYU 0</p>
    `;
    shippingCostElem.textContent = "Indefinido";
    return;
  }

  if (tasaUSDToUYU === null) tasaUSDToUYU = await obtenerTasaUSDToUYU();

  let subtotalUSD = 0, subtotalUYU = 0, tieneUSD = false, tieneUYU = false;

  cart.forEach(p => {
    if (p.currency === "USD") {
      const monto = p.cost * p.quantity;
      subtotalUSD += monto;
      subtotalUYU += monto * tasaUSDToUYU;
      tieneUSD = true;
    } else if (p.currency === "UYU") {
      const montoUYU = p.cost * p.quantity;
      subtotalUYU += montoUYU;
      subtotalUSD += montoUYU / tasaUSDToUYU;
      tieneUYU = true;
    }
  });

  if (descuentoAplicado > 0) {
    subtotalUYU *= (1 - descuentoAplicado);
    subtotalUSD *= (1 - descuentoAplicado);
  }

  let costoEnvioUYU = 0;
  const tipoEnvio = document.querySelector('input[name="shipping"]:checked');
  if (direccionGuardada && tipoEnvio) {
    costoEnvioUYU = subtotalUYU * costoEnvioPorcentaje;
    subtotalUYU += costoEnvioUYU;
  }

  let html = `<p class="text-sm mb-1 text-text-light-secondary dark:text-text-dark-secondary">Subtotal</p>`;
  if (tieneUSD && tieneUYU) {
    html += `
      <p class="text-2xl font-bold text-accent dark:text-text-dark-primary">USD ${subtotalUSD.toLocaleString('es-UY', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
      <p class="text-2xl font-bold text-accent dark:text-text-dark-primary">UYU ${Math.round(subtotalUYU).toLocaleString('es-UY')}</p>
      <p class="text-xs text-text-light-secondary dark:text-text-dark-secondary mt-1">1 USD = ${tasaUSDToUYU.toLocaleString('es-UY', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} UYU</p>`;
  } else if (tieneUSD) {
    html += `<p class="text-2xl font-bold text-accent dark:text-text-dark-primary">USD ${subtotalUSD.toLocaleString('es-UY', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>`;
  } else if (tieneUYU) {
    html += `<p class="text-2xl font-bold text-accent dark:text-text-dark-primary">UYU ${Math.round(subtotalUYU).toLocaleString('es-UY')}</p>`;
  }

  if (costoEnvioUYU > 0) {
    const porcentaje = (costoEnvioPorcentaje * 100).toFixed(0);
    html += `<p class="text-xs text-text-light-secondary dark:text-text-dark-secondary mt-1">+ Envío (${porcentaje}%): UYU ${Math.round(costoEnvioUYU).toLocaleString('es-UY')}</p>`;
  }

  subtotalElem.innerHTML = html;

  if (costoEnvioUYU > 0) {
    shippingCostElem.textContent = `UYU ${Math.round(costoEnvioUYU).toLocaleString('es-UY')}`;
  } else {
    shippingCostElem.textContent = "Indefinido";
  }
}

// ============================================================
// CUPONES
// ============================================================
const CUPONES_VALIDOS = {
  "BIENVENIDO10": 0.10,
  "DISCULPAS": 0.15,
  "NOSOYPELADO": 0.99
};

function aplicarCupon() {
  const input = document.getElementById("coupon-input").value.trim().toUpperCase();
  const mensaje = document.getElementById("coupon-message");

  if (CUPONES_VALIDOS[input]) {
    descuentoAplicado = CUPONES_VALIDOS[input];
    mensaje.textContent = `¡Cupón aplicado! -${(descuentoAplicado * 100).toFixed(0)}%`;
    mensaje.className = "text-sm text-green-600 dark:text-green-400";
    mensaje.classList.remove("hidden");
  } else {
    descuentoAplicado = 0;
    mensaje.textContent = "Cupón inválido";
    mensaje.className = "text-sm text-red-600 dark:text-red-400";
    mensaje.classList.remove("hidden");
  }
  document.getElementById("coupon-input").value = "";
  actualizarSubtotal();
}

// ============================================================
// DIRECCIÓN
// ============================================================
function manejarEnvio(e) {
  e.preventDefault();
  const campos = [
    { id: "dept", nombre: "Departamento" },
    { id: "localidad", nombre: "Localidad" },
    { id: "calle", nombre: "Calle" },
    { id: "numero", nombre: "Número" }
  ];

  let valido = true;
  for (const campo of campos) {
    const input = document.getElementById(campo.id);
    if (!input.value.trim()) {
      alert(`Por favor, completa el campo: ${campo.nombre}`);
      input.focus();
      valido = false;
      break;
    }
  }
  if (!valido) return;

  const direccion = {
    dept: document.getElementById("dept").value.trim(),
    localidad: document.getElementById("localidad").value.trim(),
    calle: document.getElementById("calle").value.trim(),
    numero: document.getElementById("numero").value.trim(),
    esquina: document.getElementById("esquina").value.trim()
  };

  if (document.getElementById("save-address").checked) {
    localStorage.setItem("direccionPredeterminada", JSON.stringify(direccion));
  }
  direccionGuardada = direccion;

  mostrarCheckDireccion();
  mostrarOpcionesEnvio();
  actualizarSubtotal();
  verificarBotonPagar();
}

function mostrarCheckDireccion() {
  const boton = document.querySelector("#shipping-form button[type='submit']");
  boton.innerHTML = `Dirección confirmada <span class="material-symbols-outlined ml-2">check_circle</span>`;
  boton.classList.remove("bg-primary", "hover:bg-primary/90");
  boton.classList.add("bg-green-500", "hover:bg-green-600", "text-white");
  boton.disabled = true;
}

function rellenarFormularioDireccion(dir) {
  document.getElementById("dept").value = dir.dept || "";
  document.getElementById("localidad").value = dir.localidad || "";
  document.getElementById("calle").value = dir.calle || "";
  document.getElementById("numero").value = dir.numero || "";
  document.getElementById("esquina").value = dir.esquina || "";
}

function mostrarOpcionesEnvio() {
  const opciones = document.getElementById("shipping-options");
  opciones.classList.remove("hidden");
  opciones.classList.add("flex");
}

// ============================================================
// BOTÓN PAGAR
// ============================================================
function verificarBotonPagar() {
  const boton = document.getElementById("checkout-button");
  const tipoEnvio = document.querySelector('input[name="shipping"]:checked');
  const cart = JSON.parse(localStorage.getItem("cart")) || [];

  if (cart.length === 0) {
    boton.disabled = true;
    boton.classList.remove("bg-primary", "hover:bg-primary/90", "text-accent");
    boton.classList.add("bg-accent/20", "dark:bg-text-dark-secondary/20", "text-accent/50", "dark:text-text-dark-secondary");
    boton.textContent = "Carrito vacío";
  } else if (direccionGuardada && tipoEnvio) {
    boton.disabled = false;
    boton.classList.remove("bg-accent/20", "dark:bg-text-dark-secondary/20", "text-accent/50", "dark:text-text-dark-secondary");
    boton.classList.add("bg-primary", "hover:bg-primary/90", "text-accent");
    boton.textContent = "Continuar con la Compra";
  } else {
    boton.disabled = true;
    boton.classList.remove("bg-primary", "hover:bg-primary/90", "text-accent");
    boton.classList.add("bg-accent/20", "dark:bg-text-dark-secondary/20", "text-accent/50", "dark:text-text-dark-secondary");
    boton.textContent = "Complete dirección y envío";
  }
}

// ============================================================
// MODAL DE PAGO
// ============================================================
function mostrarFormularioPago(metodo) {
  metodoSeleccionado = metodo;
  const container = document.getElementById("payment-form-container");
  let html = "";

  if (metodo === "redes") {
    html = `
      <div class="rounded-xl bg-background-light dark:bg-background-dark p-4">
        <h6 class="font-bold mb-3 text-accent dark:text-text-dark-primary">Efectivo por redes de cobranza</h6>
        <div class="grid grid-cols-2 gap-3">
          <div class="col-span-2 sm:col-span-1">
            <label class="block text-sm font-medium mb-1 text-accent dark:text-text-dark-primary">C.I.</label>
            <input type="text" class="w-full rounded-md border-border-light dark:border-border-dark bg-surface-light dark:bg-surface-dark text-accent dark:text-text-dark-primary focus:border-primary focus:ring-primary/50" id="ci" placeholder="1.234.567-8" required>
          </div>
          <div class="col-span-2 sm:col-span-1">
            <label class="block text-sm font-medium mb-1 text-accent dark:text-text-dark-primary">Nombre y Apellido</label>
            <input type="text" class="w-full rounded-md border-border-light dark:border-border-dark bg-surface-light dark:bg-surface-dark text-accent dark:text-text-dark-primary focus:border-primary focus:ring-primary/50" id="nombre-apellido" required>
          </div>
        </div>
      </div>`;
  } else if (metodo === "tarjeta") {
    html = `
      <div class="rounded-xl bg-background-light dark:bg-background-dark p-4">
        <h6 class="font-bold mb-3 text-accent dark:text-text-dark-primary">Tarjeta de crédito/débito</h6>
        <div class="grid grid-cols-3 gap-3">
          <div class="col-span-3">
            <label class="block text-sm font-medium mb-1 text-accent dark:text-text-dark-primary">Número de tarjeta</label>
            <input type="text" class="w-full rounded-md border-border-light dark:border-border-dark bg-surface-light dark:bg-surface-dark text-accent dark:text-text-dark-primary focus:border-primary focus:ring-primary/50" id="card-number" placeholder="1234 5678 9012 3456" maxlength="19" required>
          </div>
          <div class="col-span-3 sm:col-span-1">
            <label class="block text-sm font-medium mb-1 text-accent dark:text-text-dark-primary">Vencimiento</label>
            <input type="text" class="w-full rounded-md border-border-light dark:border-border-dark bg-surface-light dark:bg-surface-dark text-accent dark:text-text-dark-primary focus:border-primary focus:ring-primary/50" id="card-expiry" placeholder="MM/AA" maxlength="5" required>
          </div>
          <div class="col-span-3 sm:col-span-1">
            <label class="block text-sm font-medium mb-1 text-accent dark:text-text-dark-primary">CVV</label>
            <input type="text" class="w-full rounded-md border-border-light dark:border-border-dark bg-surface-light dark:bg-surface-dark text-accent dark:text-text-dark-primary focus:border-primary focus:ring-primary/50" id="card-cvv" placeholder="123" maxlength="4" required>
          </div>
          <div class="col-span-3 sm:col-span-1">
            <label class="block text-sm font-medium mb-1 text-accent dark:text-text-dark-primary">Titular</label>
            <input type="text" class="w-full rounded-md border-border-light dark:border-border-dark bg-surface-light dark:bg-surface-dark text-accent dark:text-text-dark-primary focus:border-primary focus:ring-primary/50" id="card-holder" required>
          </div>
        </div>
      </div>`;
  } else if (metodo === "transferencia") {
    html = `
      <div class="rounded-xl bg-background-light dark:bg-background-dark p-4">
        <h6 class="font-bold mb-3 text-accent dark:text-text-dark-primary">Transferencia bancaria</h6>
        <div class="grid grid-cols-2 gap-3">
          <div class="col-span-2 sm:col-span-1">
            <label class="block text-sm font-medium mb-1 text-accent dark:text-text-dark-primary">Tipo de cuenta</label>
            <select class="w-full rounded-md border-border-light dark:border-border-dark bg-surface-light dark:bg-surface-dark text-accent dark:text-text-dark-primary focus:border-primary focus:ring-primary/50" id="account-type" required>
              <option value="">Seleccionar...</option>
              <option value="caja-ahorro">Caja de Ahorro</option>
              <option value="cuenta-corriente">Cuenta Corriente</option>
            </select>
          </div>
          <div class="col-span-2 sm:col-span-1">
            <label class="block text-sm font-medium mb-1 text-accent dark:text-text-dark-primary">Número de cuenta</label>
            <input type="text" class="w-full rounded-md border-border-light dark:border-border-dark bg-surface-light dark:bg-surface-dark text-accent dark:text-text-dark-primary focus:border-primary focus:ring-primary/50" id="account-number" placeholder="1234567890" required>
          </div>
        </div>
      </div>`;
  }

  container.innerHTML = html;
}

function confirmarPago() {
  const datos = {};

  if (metodoSeleccionado === "redes") {
    const ci = document.getElementById("ci").value.trim();
    const nombre = document.getElementById("nombre-apellido").value.trim();
    if (!ci || !nombre) return alert("Completa todos los campos");
    datos.metodo = "Redes de cobranza";
    datos.ci = ci;
    datos.titular = nombre;
  } else if (metodoSeleccionado === "tarjeta") {
    const numero = document.getElementById("card-number").value.replace(/\s/g, '');
    const expiry = document.getElementById("card-expiry").value;
    const cvv = document.getElementById("card-cvv").value;
    const titular = document.getElementById("card-holder").value;
    if (!numero || !expiry || !cvv || !titular) return alert("Completa todos los campos");
    if (numero.length < 13) return alert("Número de tarjeta inválido");
    datos.metodo = "Tarjeta";
    datos.numero = numero;
    datos.vencimiento = expiry;
    datos.cvv = cvv;
    datos.titular = titular;
  } else if (metodoSeleccionado === "transferencia") {
    const tipo = document.getElementById("account-type").value;
    const numero = document.getElementById("account-number").value;
    if (!tipo || !numero) return alert("Completa todos los campos");
    datos.metodo = "Transferencia";
    datos.tipo = tipo;
    datos.numero = numero;
  }

  alert(`¡Pago confirmado por ${datos.metodo}!\n\n${Object.entries(datos).slice(1).map(([k, v]) => `${k}: ${v}`).join("\n")}`);
  cerrarModal();
  localStorage.removeItem("cart");
  dibujarProductos();
  actualizarSubtotal();
  verificarBotonPagar();

  // Actualizar contador del carrito en el nav
  if (typeof window.actualizarContadorCarrito === 'function') {
    window.actualizarContadorCarrito();
  }
}

// ============================================================
// CARRITO
// ============================================================
function disminuirCantidad(i) {
  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  if (cart[i].quantity > 1) {
    cart[i].quantity -= 1;
    localStorage.setItem("cart", JSON.stringify(cart));
  }
  dibujarProductos();
  actualizarSubtotal();

  if (typeof window.actualizarContadorCarrito === 'function') {
    window.actualizarContadorCarrito();
  }
}

function aumentarCantidad(i) {
  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  cart[i].quantity += 1;
  localStorage.setItem("cart", JSON.stringify(cart));
  dibujarProductos();
  actualizarSubtotal();

  if (typeof window.actualizarContadorCarrito === 'function') {
    window.actualizarContadorCarrito();
  }
}

function eliminarProducto(i) {
  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  cart.splice(i, 1);
  localStorage.setItem("cart", JSON.stringify(cart));
  dibujarProductos();
  actualizarSubtotal();
  verificarBotonPagar();

  if (typeof window.actualizarContadorCarrito === 'function') {
    window.actualizarContadorCarrito();
  }
}

function dibujarProductos() {
  const container = document.getElementById("cart-container");
  const cart = JSON.parse(localStorage.getItem("cart")) || [];

  if (cart.length === 0) {
    container.innerHTML = `
      <div class="text-center py-12">
        <span class="material-symbols-outlined text-6xl text-text-light-secondary dark:text-text-dark-secondary mb-4">shopping_cart</span>
        <p class="text-lg text-text-light-secondary dark:text-text-dark-secondary">No hay productos en el carrito</p>
      </div>
    `;
    return;
  }

  let html = "";
  cart.forEach((p, i) => {
    const total = p.cost * p.quantity;
    html += `
      <div class="flex flex-col sm:flex-row gap-4 justify-between border-b border-border-light dark:border-border-dark pb-4 last:border-b-0 last:pb-0">
        <div class="flex items-start gap-4">
          <div class="bg-center bg-no-repeat aspect-square bg-cover rounded-lg size-20 sm:size-24 flex-shrink-0" style="background-image: url('${p.image}');"></div>
          <div class="flex flex-1 flex-col justify-center gap-1">
            <p class="text-base font-bold leading-normal text-accent dark:text-text-dark-primary">${p.name}</p>
            <p class="text-sm font-normal leading-normal text-text-light-secondary dark:text-text-dark-secondary">Precio: ${p.currency} ${p.cost}</p>
            <p class="text-sm font-medium leading-normal text-accent dark:text-text-dark-primary">Subtotal: ${p.currency} ${total}</p>
          </div>
        </div>
        <div class="flex flex-row sm:flex-col items-center justify-between gap-3">
          <div class="flex items-center gap-2">
            <button onclick="disminuirCantidad(${i})" class="text-lg font-medium leading-normal flex h-8 w-8 items-center justify-center rounded-full bg-background-light dark:bg-background-dark cursor-pointer hover:bg-primary/20 hover:text-primary transition-colors text-accent dark:text-text-dark-primary">-</button>
            <input class="text-base font-medium leading-normal w-8 p-0 text-center bg-transparent focus:outline-0 focus:ring-0 focus:border-none border-none [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none text-accent dark:text-text-dark-primary" type="number" value="${p.quantity}" readonly/>
            <button onclick="aumentarCantidad(${i})" class="text-lg font-medium leading-normal flex h-8 w-8 items-center justify-center rounded-full bg-background-light dark:bg-background-dark cursor-pointer hover:bg-primary/20 hover:text-primary transition-colors text-accent dark:text-text-dark-primary">+</button>
          </div>
          <button onclick="eliminarProducto(${i})" class="flex h-8 w-8 cursor-pointer items-center justify-center text-text-light-secondary dark:text-text-dark-secondary hover:text-red-500 transition-colors">
            <span class="material-symbols-outlined text-xl">delete</span>
          </button>
        </div>
      </div>
    `;
  });

  container.innerHTML = html;
}