// ============================================================
// VARIABLES GLOBALES
// ============================================================
let tasaUSDToUYU = null;
const TASA_FALLBACK_UYU_USD = 43;

let descuentoAplicado = 0;
let costoEnvioPorcentaje = 0.05;
let direccionGuardada = JSON.parse(localStorage.getItem("direccionPredeterminada")) || null;

// Modal
const paymentModal = new bootstrap.Modal(document.getElementById('paymentModal'));
let metodoSeleccionado = null;

// Tooltip
let tooltipInstance = null;

// ============================================================
// DOMContentLoaded
// ============================================================
document.addEventListener("DOMContentLoaded", function () {
  cargarTasaYActualizar();
  inicializarEventos();
  verificarBotonPagar();
  actualizarTooltipDinamico(); // ← Ejecutar al inicio

  // Escuchar cambios
  document.getElementById("shipping-form").addEventListener("submit", actualizarTooltipDinamico);
  document.querySelectorAll('input[name="shipping"]').forEach(radio => {
    radio.addEventListener("change", actualizarTooltipDinamico);
  });
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

  if (direccionGuardada) {
    rellenarFormularioDireccion(direccionGuardada);
    mostrarOpcionesEnvio();
    verificarBotonPagar();
  }

  document.getElementById("checkout-button").addEventListener("click", () => {
    paymentModal.show();
    mostrarFormularioPago("redes");
  });

  document.querySelectorAll('input[name="payment"]').forEach(radio => {
    radio.addEventListener("change", () => mostrarFormularioPago(radio.value));
  });

  document.getElementById("confirm-payment").addEventListener("click", confirmarPago);
}

// ============================================================
// TOOLTIP DINÁMICO - ARREGLADO
// ============================================================
function actualizarTooltipDinamico() {
  const wrapper = document.getElementById("checkout-wrapper");
  const boton = document.getElementById("checkout-button");

  if (!wrapper || !boton) return;

  // Si el botón está deshabilitado → mostrar tooltip
  if (boton.disabled) {
    // Crear tooltip si no existe
    if (!wrapper._tooltip) {
      wrapper._tooltip = new bootstrap.Tooltip(wrapper, {
        title: "Rellenar todos los campos y seleccionar método de envío para proceder",
        placement: "top",
        trigger: "hover focus"
      });
    }
  } else {
    // Si está habilitado → destruir tooltip
    if (wrapper._tooltip) {
      wrapper._tooltip.dispose();
      wrapper._tooltip = null;
    }
  }
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
    subtotalElem.innerHTML = `<p class="text-muted mb-1">Subtotal</p><p class="fs-5 fw-bold">UYU 0</p>`;
    shippingCostElem.textContent = "Indefinido";
    shippingCostElem.className = "fw-bold text-muted";
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
  const tipoEnvio = document.querySelector('#shipping-options input[name="shipping"]:checked');
  if (direccionGuardada && tipoEnvio) {
    costoEnvioUYU = subtotalUYU * costoEnvioPorcentaje;
    subtotalUYU += costoEnvioUYU;
  }

  let html = `<p class="text-muted mb-1">Subtotal</p>`;
  if (tieneUSD && tieneUYU) {
    html += `
      <p class="fs-5 fw-bold">USD ${subtotalUSD.toLocaleString('es-UY', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
      <p class="fs-5 fw-bold">UYU ${Math.round(subtotalUYU).toLocaleString('es-UY')}</p>
      <p class="text-muted small">1 USD = ${tasaUSDToUYU.toLocaleString('es-UY', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} UYU</p>`;
  } else if (tieneUSD) {
    html += `<p class="fs-5 fw-bold">USD ${subtotalUSD.toLocaleString('es-UY', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>`;
  } else if (tieneUYU) {
    html += `<p class="fs-5 fw-bold">UYU ${Math.round(subtotalUYU).toLocaleString('es-UY')}</p>`;
  }

  if (costoEnvioUYU > 0) {
    const porcentaje = (costoEnvioPorcentaje * 100).toFixed(0);
    html += `<p class="text-muted small">+ Envío (${porcentaje}%): UYU ${Math.round(costoEnvioUYU).toLocaleString('es-UY')}</p>`;
  }

  subtotalElem.innerHTML = html;

  if (costoEnvioUYU > 0) {
    shippingCostElem.textContent = `UYU ${Math.round(costoEnvioUYU).toLocaleString('es-UY')}`;
    shippingCostElem.className = "fw-bold text-success";
  } else {
    shippingCostElem.textContent = "Indefinido";
    shippingCostElem.className = "fw-bold text-muted";
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
    mensaje.className = "text-success small";
  } else {
    descuentoAplicado = 0;
    mensaje.textContent = "Cupón inválido";
    mensaje.className = "text-danger small";
  }
  document.getElementById("coupon-input").value = "";
  actualizarSubtotal();
}

// ============================================================
// DIRECCIÓN + CHECK VERDE
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
      input.classList.add("is-invalid");
      valido = false;
    } else {
      input.classList.remove("is-invalid");
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
  boton.innerHTML = `Dirección confirmada <i class="bi bi-check-circle-fill text-success ms-2"></i>`;
  boton.classList.remove("btn-primary");
  boton.classList.add("btn-success");
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
  document.getElementById("shipping-options").classList.remove("d-none");
}

// ============================================================
// BOTÓN PAGAR
// ============================================================
function verificarBotonPagar() {
  const boton = document.getElementById("checkout-button");
  const tipoEnvio = document.querySelector('#shipping-options input[name="shipping"]:checked');

  if (direccionGuardada && tipoEnvio) {
    boton.disabled = false;
    boton.classList.remove("btn-secondary");
    boton.classList.add("btn-warning");
  } else {
    boton.disabled = true;
    boton.classList.remove("btn-warning");
    boton.classList.add("btn-secondary");
  }

  // FORZAR TOOLTIP
  actualizarTooltipDinamico();
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
      <div class="card p-3">
        <h6>Efectivo por redes de cobranza</h6>
        <div class="row g-3">
          <div class="col-md-6">
            <label class="form-label">C.I.</label>
            <input type="text" class="form-control" id="ci" placeholder="1.234.567-8" required>
          </div>
          <div class="col-md-6">
            <label class="form-label">Nombre y Apellido</label>
            <input type="text" class="form-control" id="nombre-apellido" required>
          </div>
        </div>
      </div>`;
  } else if (metodo === "tarjeta") {
    html = `
      <div class="card p-3">
        <h6>Tarjeta de crédito/débito</h6>
        <div class="row g-3">
          <div class="col-12">
            <label class="form-label">Número de tarjeta</label>
            <input type="text" class="form-control" id="card-number" placeholder="1234 5678 9012 3456" maxlength="19" required>
          </div>
          <div class="col-md-4">
            <label class="form-label">Vencimiento</label>
            <input type="text" class="form-control" id="card-expiry" placeholder="MM/AA" maxlength="5" required>
          </div>
          <div class="col-md-4">
            <label class="form-label">CVV</label>
            <input type="text" class="form-control" id="card-cvv" placeholder="123" maxlength="4" required>
          </div>
          <div class="col-md-4">
            <label class="form-label">Titular</label>
            <input type="text" class="form-control" id="card-holder" required>
          </div>
        </div>
      </div>`;
  } else if (metodo === "transferencia") {
    html = `
      <div class="card p-3">
        <h6>Transferencia bancaria</h6>
        <div class="row g-3">
          <div class="col-md-6">
            <label class="form-label">Tipo de cuenta</label>
            <select class="form-select" id="account-type" required>
              <option value="">Seleccionar...</option>
              <option value="caja-ahorro">Caja de Ahorro</option>
              <option value="cuenta-corriente">Cuenta Corriente</option>
            </select>
          </div>
          <div class="col-md-6">
            <label class="form-label">Número de cuenta</label>
            <input type="text" class="form-control" id="account-number" placeholder="1234567890" required>
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
  paymentModal.hide();
  localStorage.removeItem("cart");
  dibujarProductos();
  actualizarSubtotal();
  verificarBotonPagar();
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
}

function aumentarCantidad(i) {
  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  cart[i].quantity += 1;
  localStorage.setItem("cart", JSON.stringify(cart));
  dibujarProductos();
  actualizarSubtotal();
}

function eliminarProducto(i) {
  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  cart.splice(i, 1);
  localStorage.setItem("cart", JSON.stringify(cart));
  dibujarProductos();
  actualizarSubtotal();
}

function dibujarProductos() {
  const container = document.getElementById("cart-container");

  if (localStorage.getItem("cart") == "") {
    console.log("alo")
    container.innerHTML = `<div class="alert-secondary text-center p-4">No hay productos en el carrito.</div>`;
    return;
  }

  const cart = JSON.parse(localStorage.getItem("cart")) || [];


  let tabla = `
    <table class="tabla-productos table align-middle shadow-sm">
      <thead class="table-light">
        <tr>
          <th>Producto</th>
          <th class="text-center">Cantidad</th>
          <th class="text-end">Precio</th>
          <th class="text-end">Total</th>
          <th class="text-end"></th>
        </tr>
      </thead>
      <tbody>`;

  cart.forEach((p, i) => {
    const total = p.cost * p.quantity;
    tabla += `
      <tr>
        <td><img src="${p.image}" style="width:60px;height:60px;object-fit:cover;" class="me-2">${p.name}</td>
        <td class="text-center">
          <button onclick="disminuirCantidad(${i})" class="btn btn-sm btn-outline-secondary">-</button>
          ${p.quantity}
          <button onclick="aumentarCantidad(${i})" class="btn btn-sm btn-outline-secondary">+</button>
        </td>
        <td class="text-end">${p.currency} ${p.cost}</td>
        <td class="text-end fw-semibold">${p.currency} ${total}</td>
        <td class="text-center">
          <button onclick="eliminarProducto(${i})" class="btn btn-sm btn-outline-danger">
            <i class="fa-solid fa-trash"></i>
          </button>
        </td>
      </tr>`;
  });

  tabla += `</tbody></table>`;
  container.innerHTML = tabla;
}