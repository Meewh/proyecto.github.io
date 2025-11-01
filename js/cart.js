document.addEventListener("DOMContentLoaded", function () {
  const cartContainer = document.getElementById("cart-container");
  const subtotalElem = document.getElementById("subtotal");

  // Cargar productos desde localStorage
  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  if (cart.length === 0) {
    cartContainer.innerHTML = `
      <tr class="alert alert-secondary text-center p-4">
        <td class="text-center">No hay productos en el carrito.</td>
      </tr>`;
    subtotalElem.textContent = "$U 0";
    return;
  }

  let tabla = `
    <table class="tabla-productos table align-middle shadow-sm">
      <thead class="table-light">
        <tr>
          <th>Producto</th>
          <th class="text-center">Cantidad</th>
          <th class="text-end">Precio</th>
          <th class="text-end">Total</th>
        </tr>
      </thead>
      <tbody>
  `;

  cart.forEach((p, index) => {
    const total = p.cost * p.quantity;
    tabla += `
      <tr>
        <td><img src="${p.image}" style="width:60px;height:60px;object-fit:cover;"> ${p.name}</td>
        <td class="text-center">${p.quantity}</td>
        <td class="text-end">${p.currency} ${p.cost}</td>
        <td class="text-end fw-semibold">${p.currency} ${total}</td>
      </tr>`;
  });

  tabla += `</tbody></table>`;
  cartContainer.innerHTML = tabla;

  const subtotal = cart.reduce((acc, p) => acc + p.cost * p.quantity, 0);
  subtotalElem.textContent = `${cart[0].currency} ${subtotal}`;
});

//  id: productData.id,
//         name: productData.name,
//         cost: productData.cost,
//         currency: productData.currency,
//         image: productData.images[0],
//         quantity: 1

tabla += `</tbody></table>`;
cartContainer.innerHTML = tabla;

// Actualizar totales globales
function actualizarSubtotal() {
  const productos = JSON.parse(localStorage.getItem("cart")) || [];
  const subtotal = productos.reduce((acc, p) => acc + p.costo * p.cantidad, 0);
  document.getElementById("subtotal").textContent = `$U ${subtotal}`;
}
actualizarSubtotal();

// Escuchar eventos de los botones y inputs
cartContainer.addEventListener("click", (e) => {
  const btn = e.target;
  const index = btn.dataset.index;
  if (index === undefined) return;

  if (btn.dataset.action === "sumar") {
    productos[index].cantidad++;
  } else if (btn.dataset.action === "restar" && productos[index].cantidad > 1) {
    productos[index].cantidad--;
  }

  // Actualizar UI
  const input = cartContainer.querySelector(`input[data-index="${index}"]`);
  input.value = productos[index].cantidad;
  document.getElementById(`total-${index}`).textContent = `$U ${productos[index].costo * productos[index].cantidad}`;
  actualizarSubtotal();
  localStorage.setItem("productos", JSON.stringify(productos));
});

// Si se edita manualmente la cantidad
cartContainer.addEventListener("input", (e) => {
  if (e.target.matches("input[type='number']")) {
    const index = e.target.dataset.index;
    const nuevaCantidad = Math.max(1, parseInt(e.target.value) || 1);
    productos[index].cantidad = nuevaCantidad;
    document.getElementById(`total-${index}`).textContent = `$U ${productos[index].costo * productos[index].cantidad}`;
    actualizarSubtotal();
    localStorage.setItem("cart", JSON.stringify(productos));
  }
});

document.addEventListener("DOMContentLoaded", () => {
  const cartContainer = document.getElementById("cart-items");
  const cart = JSON.parse(localStorage.getItem("cart")) || [];

  if (cart.length === 0) {
    cartContainer.innerHTML = "<p>Tu carrito está vacío.</p>";
    return;
  }

  cartContainer.innerHTML = cart.map(product => `
    <div class="col-md-4">
      <div class="card h-100 p-2">
        <img src="${product.image}" class="card-img-top" alt="${product.name}">
        <div class="card-body">
          <h5 class="card-title">${product.name}</h5>
          <p>${product.currency} ${product.cost}</p>
          <p>Cantidad: ${product.quantity}</p>
        </div>
      </div>
    </div>
  `).join("");
});

// cart.js
document.addEventListener("DOMContentLoaded", async function () {
  const productId = localStorage.getItem("selectedProductId");

  if (productId) {
    try {
      const response = await fetch(`https://tu-api.com/productos/${productId}`);
      const product = await response.json();

      mostrarProductoEnCarrito(product);
    } catch (error) {
      console.error("Error cargando el producto:", error);
    }
  } else {
    console.log("No hay producto seleccionado.");
  }
});

function mostrarProductoEnCarrito(product) {
  const cartContainer = document.getElementById("cart-container");

  cartContainer.innerHTML = `
    <div class="cart-item">
      <img src="${product.image}" alt="${product.name}">
      <h3>${product.name}</h3>
      <p>${product.description}</p>
      <p><strong>Precio:</strong> $${product.price}</p>
    </div>
  `;
}
