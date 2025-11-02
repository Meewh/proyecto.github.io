document.addEventListener("DOMContentLoaded", function () {

  dibujarProductos();
  actualizarSubtotal();

});

// Actualizar totales globales
function actualizarSubtotal() {
  const subtotalElem = document.getElementById("subtotal");
  const cart = JSON.parse(localStorage.getItem("cart")) || "[]";
  if (cart.length > 0) {
    const subtotal = cart.reduce((acc, p) => acc + p.cost * p.quantity, 0);
    subtotalElem.textContent = `${cart[0].currency} ${subtotal}`;
  } else {
    subtotalElem.textContent = 0;
  }

}

function disminuirCantidad(index) {
  const productos = JSON.parse(localStorage.getItem("cart") || "[]");
  if (productos[index].quantity > 1) {
    productos[index].quantity -= 1;
    localStorage.removeItem("cart");
    localStorage.setItem("cart", JSON.stringify(productos));
  }

  dibujarProductos();
  actualizarSubtotal();
}

function aumentarCantidad(index) {
  const productos = JSON.parse(localStorage.getItem("cart") || "[]");
  productos[index].quantity += 1;
  localStorage.removeItem("cart");
  localStorage.setItem("cart", JSON.stringify(productos));

  dibujarProductos();
  actualizarSubtotal();
}

function eliminarProducto(index) {
  const productos = JSON.parse(localStorage.getItem("cart") || "[]");
  productos.splice(index, 1);
  localStorage.removeItem("cart");
  localStorage.setItem("cart", JSON.stringify(productos));

  dibujarProductos();
  actualizarSubtotal();
}

function dibujarProductos() {
  const cartContainer = document.getElementById("cart-container");

  // Cargar productos desde localStorage
  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  if (cart.length === 0) {
    cartContainer.innerHTML = `
      <tr class="alert alert-secondary text-center p-4">
        <td class="text-center">No hay productos en el carrito.</td>
      </tr>`;
    const subtotalElem = document.getElementById("subtotal");
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
          <th class="text-end"></th>
        </tr>
      </thead>
      <tbody>
  `;

  cart.forEach((p, index) => {
    const total = p.cost * p.quantity;
    tabla += `
      <tr">
        <td><img src="${p.image}" style="width:60px;height:60px;object-fit:cover;"> ${p.name}</td>
        <td class="text-center">
        <button onclick="disminuirCantidad(${index})" id="down-button" class="button"> <span>&#8681;</span></i> </button>
        ${p.quantity}
        <button onclick="aumentarCantidad(${index})" id="up-button" class="button"> <span>&#8679;</span> </button>
        </td>
        <td class="text-end">${p.currency} ${p.cost}</td>
        <td class="text-end fw-semibold">${p.currency} ${total}</td>
        <td class="text-center">
        <button onclick="eliminarProducto(${index})" id="delete-button" class="button">  <i class="fa-solid fa-trash"></i> </button>
        </td>
      </tr>`;
  });

  tabla += `</tbody></table>`;
  cartContainer.innerHTML = tabla;
}