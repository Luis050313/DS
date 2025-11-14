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
      /* 🔹 NUEVO: manejo del caso 2FA */
      if (data.status === "2FA") {
        mostrarMensaje(data.message, "info");

        // Limpia el contenido principal y muestra el QR
        document.body.innerHTML = `
          <div style="text-align:center; font-family:sans-serif; margin-top:50px;">
            <h2>Segunda verificación requerida</h2>
            <p>Escanea este código QR con tu dispositivo o ingresa el código que contiene.</p>
            <img src="${data.qr}" alt="QR 2FA" style="margin:20px; width:250px; height:250px;">
            <br>
            <input id="codigo2FA" placeholder="Código de verificación" style="padding:8px; font-size:16px;">
            <button onclick="verificarCodigo2FA()" style="padding:10px 20px; font-size:16px; margin-left:10px;">Verificar</button>
          </div>
        `;
        return; // salimos, no seguimos con el flujo normal
      }

      /* 🔹 CASO NORMAL (login sin 2FA) */
      if (data.status === "success") {
        mostrarMensaje(data.message, "success");

        // Guardar token JWT si existe
        if (data.token) {
          localStorage.setItem("token", data.token);
        }

        // Determinar destino según tipo de usuario
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

/* 🔹 NUEVA FUNCIÓN: verificar el código 2FA */
function verificarCodigo2FA() {
  const codigo = document.getElementById("codigo2FA").value.trim();

  if (!codigo) {
    alert("Por favor ingresa el código de verificación.");
    return;
  }

  const formData = new FormData();
  formData.append("codigo", codigo);

  fetch("php/verificar2FA.php", {
    method: "POST",
    body: formData
  })
    .then(res => res.json())
    .then(data => {
      if (data.status === "success") {
        // Guardar el token en localStorage
        if (data.token) {
          localStorage.setItem("token", data.token);
        }
        alert("✅ Verificación completada. Accediendo al sistema...");
        window.location.href = "Auxi/auxiliar.html";
      } else {
        alert(data.message);
      }
    })
    .catch(err => {
      console.error(err);
      alert("Error al verificar el código.");
    });
}