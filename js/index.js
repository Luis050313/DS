/*
 * Este bloque desactiva el botón de inicio hasta que el usuario escriba
 * exactamente 4 o 8 caracteres en el campo "usuario"
 */
document.addEventListener("DOMContentLoaded", () => {
  const usuarioInput = document.getElementById("usuario");
  const boton = document.querySelector("button");

  // Desactivar el botón al inicio
  boton.disabled = true;
  boton.style.opacity = "0.6";
  boton.style.cursor = "not-allowed";

  usuarioInput.addEventListener("input", () => {
    const valor = usuarioInput.value.trim();

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

/*
 * Función de login: envía los datos al servidor y maneja la respuesta
 */
function login() {
  const usuario = document.getElementById("usuario").value.trim();
  const password = document.getElementById("password").value.trim();

  if (!usuario || !password) {
    mostrarMensaje("Por favor, llena todos los campos", "error");
    return;
  }

  const formData = new FormData();
  formData.append("usuario", usuario);
  formData.append("password", password);

  fetch("php/login.php", {
    method: "POST",
    body: formData
  })
    .then(response => response.json())
    .then(data => {
      if (data.status === "success") {
        mostrarMensaje(data.message, "success");
        setTimeout(() => window.location.href = "dashboard.html", 1200);
      } else {
        mostrarMensaje(data.message, "error");
      }
      usuario.value = '';
      password.value = '';
    })
    .catch(error => {
      console.error("Error en la conexión:", error);
      mostrarMensaje("Ocurrió un error al conectar con el servidor", "error");
    });
}
