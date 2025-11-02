// Espera a que todo el contenido del documento (HTML, imágenes, etc.) se cargue
// y recién ahí ejecuta las funciones iniciales.
document.addEventListener("DOMContentLoaded", function () {
  dibujarProductos();     // Dibuja los productos que hay en el carrito (si existen)
  actualizarSubtotal();   // Calcula y muestra el subtotal de todos los productos
});

// ------------------------------------------------------------
// 🔸 FUNCIÓN: Actualizar el subtotal del carrito
// ------------------------------------------------------------
function actualizarSubtotal() {
  const subtotalElem = document.getElementById("subtotal"); // Elemento donde se muestra el total
  const cart = JSON.parse(localStorage.getItem("cart")) || []; // Recupera el carrito del localStorage o array vacío si no hay nada

  // Si hay productos en el carrito...
  if (cart.length > 0) {
    // Calcula la suma total (precio * cantidad) de todos los productos
    const subtotal = cart.reduce((acc, p) => acc + p.cost * p.quantity, 0);

    // Muestra el subtotal en pantalla con la moneda del primer producto
    subtotalElem.textContent = `${cart[0].currency} ${subtotal}`;
  } else {
    // Si no hay productos, muestra 0
    subtotalElem.textContent = 0;
  }
}

// ------------------------------------------------------------
// 🔸 FUNCIÓN: Disminuir la cantidad de un producto
// ------------------------------------------------------------
function disminuirCantidad(index) {
  const productos = JSON.parse(localStorage.getItem("cart")) || []; // Obtiene el carrito actual

  // Si la cantidad del producto es mayor que 1, la reduce en 1
  if (productos[index].quantity > 1) {
    productos[index].quantity -= 1;

    // Borra y vuelve a guardar el carrito actualizado
    localStorage.removeItem("cart");
    localStorage.setItem("cart", JSON.stringify(productos));
  }

  // Redibuja la lista de productos y actualiza el subtotal
  dibujarProductos();
  actualizarSubtotal();
}

// ------------------------------------------------------------
// 🔸 FUNCIÓN: Aumentar la cantidad de un producto
// ------------------------------------------------------------
function aumentarCantidad(index) {
  const productos = JSON.parse(localStorage.getItem("cart")) || []; // Obtiene el carrito
  productos[index].quantity += 1; // Aumenta la cantidad en 1

  // Guarda los cambios en el localStorage
  localStorage.removeItem("cart");
  localStorage.setItem("cart", JSON.stringify(productos));

  // Actualiza la interfaz
  dibujarProductos();
  actualizarSubtotal();
}

// ------------------------------------------------------------
// 🔸 FUNCIÓN: Eliminar un producto del carrito
// ------------------------------------------------------------
function eliminarProducto(index) {
  const productos = JSON.parse(localStorage.getItem("cart")) || []; // Obtiene el carrito actual

  // Elimina el producto en la posición indicada
  productos.splice(index, 1);

  // Actualiza el localStorage
  localStorage.removeItem("cart");
  localStorage.setItem("cart", JSON.stringify(productos));

  // Actualiza la interfaz
  dibujarProductos();
  actualizarSubtotal();
}

// ------------------------------------------------------------
// 🔸 FUNCIÓN: Dibujar los productos del carrito en la tabla
// ------------------------------------------------------------
function dibujarProductos() {
  const cartContainer = document.getElementById("cart-container"); // Contenedor de la tabla de productos

  // Obtiene los productos guardados en el localStorage
  const cart = JSON.parse(localStorage.getItem("cart")) || [];

  // Si no hay productos, muestra un mensaje vacío
  if (cart.length === 0) {
    cartContainer.innerHTML = `
      <tr class="alert alert-secondary text-center p-4">
        <td class="text-center">No hay productos en el carrito.</td>
      </tr>`;
    const subtotalElem = document.getElementById("subtotal");
    subtotalElem.textContent = "$U 0";
    return; // Sale de la función
  }

  // Empieza a construir la tabla HTML con los productos
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

  // Recorre cada producto del carrito y genera una fila
  cart.forEach((p, index) => {
    const total = p.cost * p.quantity; // Calcula el total de ese producto (precio * cantidad)

    // Agrega una fila con los datos del producto
    tabla += `
      <tr>
        <td>
          <img src="${p.image}" style="width:60px;height:60px;object-fit:cover;">
          ${p.name}
        </td>
        <td class="text-center">
          <!-- Botón para disminuir cantidad -->
          <button onclick="disminuirCantidad(${index})" id="down-button" class="button">
            <span>&#8681;</span>
          </button>

          ${p.quantity}

          <!-- Botón para aumentar cantidad -->
          <button onclick="aumentarCantidad(${index})" id="up-button" class="button">
            <span>&#8679;</span>
          </button>
        </td>

        <td class="text-end">${p.currency} ${p.cost}</td>
        <td class="text-end fw-semibold">${p.currency} ${total}</td>

        <!-- Botón para eliminar producto -->
        <td class="text-center">
          <button onclick="eliminarProducto(${index})" id="delete-button" class="button">
            <i class="fa-solid fa-trash"></i>
          </button>
        </td>
      </tr>`;
  });

  // Cierra la tabla y la inserta en el HTML
  tabla += `</tbody></table>`;
  cartContainer.innerHTML = tabla;
}
