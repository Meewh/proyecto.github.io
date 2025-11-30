// VARIABLES PRINCIPALES
const campos = ["nombre", "apellido", "correo", "telefono"];

const foto = document.getElementById("foto_perfil");
const botonEditarFoto = document.getElementById("boton_editar_foto");
const selectorFoto = document.getElementById("seleccionar_foto");
const modalRecorte = new bootstrap.Modal(document.getElementById("modal_recorte"));
const imagenRecorte = document.getElementById("imagen_recorte");
const botonGuardarRecorte = document.getElementById("boton_guardar_recorte");

const botonEditarPerfil = document.getElementById("boton_editar_perfil");
const botonGuardar = document.getElementById("boton_guardar");

let recortador = null;

// --------------------------------------------------------
// CARGAR DATOS DEL LOGIN (user del backend)
// --------------------------------------------------------

window.addEventListener("DOMContentLoaded", () => {
  const user = JSON.parse(localStorage.getItem("user"));
  const token = localStorage.getItem("token");

  if (!token || !user) {
    alert("No estás logueado");
    window.location.href = "login.html";
    return;
  }

  document.getElementById("nombre_texto").textContent = user.nombre;
  document.getElementById("apellido_texto").textContent = user.apellido;
  document.getElementById("correo_texto").textContent = user.correo;
  document.getElementById("telefono_texto").textContent = user.telefono;

  campos.forEach((campo) => {
    document.getElementById(`${campo}_entrada`).value = user[campo] || "";
  });

  if (user.foto) {
    foto.src = user.foto;
  }
});

// --------------------------------------------------------
// EDITAR PERFIL
// --------------------------------------------------------

botonEditarPerfil.addEventListener("click", () => {
  campos.forEach((campo) => {
    document.getElementById(`${campo}_texto`).classList.add("d-none");
    document.getElementById(`${campo}_entrada`).classList.remove("d-none");
  });

  botonGuardar.classList.remove("d-none");
});

// --------------------------------------------------------
// GUARDAR CAMBIOS + BACKEND
// --------------------------------------------------------

botonGuardar.addEventListener("click", async () => {
  const userActual = JSON.parse(localStorage.getItem("user")) || {};
  const nuevosDatos = {};

  // Recorrer los campos
  campos.forEach((campo) => {
    const texto = document.getElementById(`${campo}_texto`);
    const entrada = document.getElementById(`${campo}_entrada`);

    texto.textContent = entrada.value;
    texto.classList.remove("d-none");
    entrada.classList.add("d-none");

    nuevosDatos[campo] = entrada.value;
  });

  try {
    const res = await fetch(`http://localhost:3000/users/${userActual.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(nuevosDatos)
    });

    const data = await res.json();

    if (!res.ok) {
      mostrarToast("Error al actualizar: " + (data.message || "Error desconocido"));
      return;
    }

    // Guardar datos confirmados por el backend
    const userGuardado = JSON.parse(localStorage.getItem("user")) || {};
    const actualizado = { ...userGuardado, ...data.user };
    localStorage.setItem("user", JSON.stringify(actualizado));

    mostrarToast("Perfil actualizado correctamente en el backend");

  } catch (err) {
    console.error(err);
    mostrarToast("Error de conexión con el servidor");
  }

  botonGuardar.classList.add("d-none");
});


// --------------------------------------------------------
// SUBIR FOTO
// --------------------------------------------------------

botonEditarFoto.addEventListener("click", () => selectorFoto.click());

selectorFoto.addEventListener("change", () => {
  const archivo = selectorFoto.files[0];
  if (!archivo) return;

  const lector = new FileReader();
  lector.onload = (e) => {
    imagenRecorte.src = e.target.result;
    modalRecorte.show();

    setTimeout(() => {
      recortador = new Cropper(imagenRecorte, {
        aspectRatio: 1,
        viewMode: 1,
        autoCropArea: 1,
      });
    }, 200);
  };

  lector.readAsDataURL(archivo);
});

// --------------------------------------------------------
// GUARDAR FOTO RECORTADA
// --------------------------------------------------------

botonGuardarRecorte.addEventListener("click", () => {
  if (!recortador) return;

  const lienzo = recortador.getCroppedCanvas({
    width: 400,
    height: 400,
  });

  const imgBase64 = lienzo.toDataURL("image/png");
  foto.src = imgBase64;

  const user = JSON.parse(localStorage.getItem("user")) || {};
  user.foto = imgBase64;
  localStorage.setItem("user", JSON.stringify(user));

  recortador.destroy();
  recortador = null;
  modalRecorte.hide();
});

// --------------------------------------------------------
// TOAST
// --------------------------------------------------------

function mostrarToast(msg) {
  const toastEl = document.getElementById("toastMsg");
  const toastText = document.getElementById("toastText");
  const toast = new bootstrap.Toast(toastEl);

  toastText.textContent = msg;
  toast.show();
}
