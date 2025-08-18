document.addEventListener("DOMContentLoaded", function() {
  const btn = document.querySelector("button");

  btn.addEventListener("click", function() {
    const nombre = document.getElementById("nombre").value.trim();
    const apellido = document.getElementById("apellido").value.trim();
    const direccion = document.getElementById("direccion").value.trim();
    const telefono = document.getElementById("telefono").value.trim();

    if (!nombre || !apellido || !direccion || !telefono) {
      alert("⚠️ Faltan datos. Por favor, completa todos los campos.");
    } else {
      alert("✅ Registro completado con éxito.");
    }
  });
});