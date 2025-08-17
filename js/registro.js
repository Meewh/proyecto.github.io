console.log('registro.js cargado'); // escribe un mensaje en la consola del navegador (inspeccionar elemento) 
// y comprueba que el archivo js cargo

const form = document.getElementById('registroForm');
const pass1 = document.getElementById('pass1');
const pass2 = document.getElementById('pass2');
const mensaje = document.getElementById('mensaje');
// busca en la pagina por los ID (registro.html en este caso) y
//  guarda ua referencia de cada uno en una variable para poder usarlas despues


function validarCoincidencia() {
  if (!pass1 || !pass2) return false; // si pass1 o pass2 no existe, devuelve false (no lo valida)
  if (pass1.value !== pass2.value) { //luego los compara el texto con el !== value, si no coinciden llama a pass2.setCustomValidity 
    pass2.setCustomValidity('Las contraseñas no coinciden'); 
    return false; // que da el mensaje que el campo no es valido ( https://developer.mozilla.org/en-US/docs/Web/API/HTMLObjectElement/setCustomValidity )
  } else {
    pass2.setCustomValidity(''); 
    return true;
  }
}


if (form) form.addEventListener('submit', (e) => { // esto es para si presiona enter asi el navegador no envia el formulario
  e.preventDefault();  // y este detiene el envio automatico, osea impide que el navegador envie imediatamente y regargue la pagina
  // en resumen, es para que no clickees en registrar y se envie aunque los campos esten incorrrectos

 

  if (!document.getElementById('usuario').value.trim() || !pass1.value || !pass2.value) { //revisa si se dejo campos vacios
    // el value.trim es para no tomar espacios
    mensaje.textContent = 'Completa todos los campos.'; // mensaje si se hace el vivo en poner espacios como texto
    mensaje.style.color = 'red';
    return;
  }

 
  const coinciden = validarCoincidencia();
  if (!coinciden) {
   
    pass2.reportValidity();   //esto hace que invalide si no tienes las contraseñas iguales, por eso trae la funcion validarCoincidencia
    // si coinciden, nada, si no coinciden lo reporta como error y te salta el aviso
    return; 
  }

  
  pass2.setCustomValidity('');
  mensaje.textContent = '✅ Registro exitoso.'; //si esta todo ok te da registro valido
  mensaje.style.color = 'green';

});


