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
  const usuarioInput = document.getElementById("usuario");
  const passwordInput = document.getElementById("password");

  const usuario = usuarioInput.value.trim();
  const password = passwordInput.value.trim();

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
      /*  Manejo de la validacion 2 pasos (2FA) */
      if (data.status === "2FA") {
        mostrarMensaje(data.message, "info");
        sessionStorage.setItem("qr2FA", data.qr);              // guarda el QR de la session del navegador
        sessionStorage.setItem("usuario", usuario);
        window.location.href = "Auxi/validacionDosPasos.html"; // redirigo a la pagina de validacion 2 pasos
        return;                                                // salimos, no seguimos con el flujo normal
      }

      /* Caso sin el manejo de validacion (login sin 2FA) */
      if (data.status === "success") {

        // Guardar token JWT si existe
        if (data.token) {
          localStorage.setItem("token", data.token);
        }

        // Mostrar pantalla de carga
        const loadingOverlay = document.getElementById("loading-overlay");
        loadingOverlay.classList.add("show");

        // Determinar destino según la longitud del usuario
        let destino = "";
        if (usuario.length === 4) {
          destino = "Auxi/validacionDosPasos.html";
        } else if (usuario.length === 8) {
          destino = "Alum/alumnos.html";
        }

        setTimeout(() => {
          if (destino) window.location.href = destino;
        }, 1200);

      } else {
        mostrarMensaje(data.message, "error");
      }

      // Vaciar campos después de mostrar mensaje
      usuarioInput.value = "";
      passwordInput.value = "";
    })
    .catch(error => {
      console.error("Error en la conexión:", error);
      mostrarMensaje("Ocurrió un error al conectar con el servidor", "error");
    });
}