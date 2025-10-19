let recortador;
const botonEditarPerfil = document.getElementById("boton_editar_perfil");
const botonGuardar = document.getElementById("boton_guardar");
const campos = ["nombre", "apellido", "correo", "telefono"];
const foto = document.getElementById("foto_perfil");
const botonEditarFoto = document.getElementById("boton_editar_foto");
const selectorFoto = document.getElementById("seleccionar_foto");
const modalRecorte = new bootstrap.Modal(document.getElementById("modal_recorte"));
const imagenRecorte = document.getElementById("imagen_recorte");
const botonGuardarRecorte = document.getElementById("boton_guardar_recorte");
//sirven para guardar las referencias a los elementos del HTML//

//  cargar datos guardados 
window.addEventListener("DOMContentLoaded", () => {
  const datos = JSON.parse(localStorage.getItem("datosUsuario")); //Busca los datos guardados en el navegador (localStorage)
  if (datos) {
    campos.forEach((campo) => { //Los muestra en pantalla
      document.getElementById(`${campo}_texto`).textContent = datos[campo];
    });
    if (datos.foto) foto.src = datos.foto; //carga la imagen si estaba guardada
  }
});

//  editar perfil
botonEditarPerfil.addEventListener("click", (e) => {
  e.preventDefault();
  campos.forEach((campo) => {
    const texto = document.getElementById(`${campo}_texto`);
    const entrada = document.getElementById(`${campo}_entrada`); 
    entrada.value = texto.textContent;
    texto.classList.add("d-none");
    entrada.classList.remove("d-none"); 
  });
  botonGuardar.classList.remove("d-none");
});

// guardar cambios 
botonGuardar.addEventListener("click", () => {
  const nuevosDatos = {};
  campos.forEach((campo) => {
    const texto = document.getElementById(`${campo}_texto`);
    const entrada = document.getElementById(`${campo}_entrada`);
    texto.textContent = entrada.value;
    nuevosDatos[campo] = entrada.value;
    texto.classList.remove("d-none");
    entrada.classList.add("d-none");
  });

  nuevosDatos.foto = foto.src;
  localStorage.setItem("datosUsuario", JSON.stringify(nuevosDatos)); //Los guarda en el navegador
  botonGuardar.classList.add("d-none");
  alert("✅ Cambios guardados correctamente");
});

// --- Subir foto ---
botonEditarFoto.addEventListener("click", () => {
  selectorFoto.click();
});

selectorFoto.addEventListener("change", () => {
  const archivo = selectorFoto.files[0];
  if (archivo) {
    const lector = new FileReader();
    lector.onload = function (e) {
      imagenRecorte.src = e.target.result;
      modalRecorte.show();

      setTimeout(() => {
        recortador = new Cropper(imagenRecorte, {
          aspectRatio: 1,
          viewMode: 1,
          dragMode: "move",
          autoCropArea: 1,
          responsive: true,
          background: false,
        });
      }, 300);
    };
    lector.readAsDataURL(archivo);
  }
});

// --- Guardar recorte ---
botonGuardarRecorte.addEventListener("click", () => {
  if (recortador) {
    const lienzo = recortador.getCroppedCanvas({
      width: 400,
      height: 400,
      imageSmoothingQuality: "high",
    });
    const imagenRecortada = lienzo.toDataURL("image/png");

    foto.src = imagenRecortada;
    recortador.destroy();
    recortador = null;
    modalRecorte.hide();

    const datos = JSON.parse(localStorage.getItem("datosUsuario")) || {};
    datos.foto = imagenRecortada;
    localStorage.setItem("datosUsuario", JSON.stringify(datos));
  }
});