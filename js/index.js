/*
* Este método es para que se desactive le botón, y solo se puede activar escrbibiendo 4 o 8 carácteres
*/ 
document.addEventListener("DOMContentLoaded", () => {
  const usuarioInput = document.getElementById("usuario");
  const boton = document.querySelector("button");

  // Desactivar el botón al inicio
  boton.disabled = true;
  boton.style.opacity = "0.6"; // para que se note visualmente desactivado
  boton.style.cursor = "not-allowed";

  usuarioInput.addEventListener("input", () => {
    const valor = usuarioInput.value.trim();

    // Activar solo si hay exactamente 4 o 8 caracteres
    if (valor.length === 4 || valor.length === 8) {
      boton.disabled = false;
      boton.style.opacity = "1";
      boton.style.cursor = "pointer";
    } else {
      boton.disabled = true;
      boton.style.opacity = "0.6";
      boton.style.cursor = "not-allowed";
    }
  });
});
