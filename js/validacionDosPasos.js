document.addEventListener("DOMContentLoaded", () => {
  const qr = sessionStorage.getItem("qr2FA");
  if (qr) {
    document.getElementById("qrImagen").src = qr;
  } else {
    alert("No se encontró QR. Inicia sesión nuevamente.");
    window.location.href = "../index.html";
  }
});

// Esta función verifica el código del 2FA
function verificarCodigo2FA() {
  const codigo = document.getElementById("codigo2FA").value.trim();

  if (!codigo) {
    alert("Por favor ingresa el código.");
    return;
  }

  const formData = new FormData();
  formData.append("codigo", codigo);

  fetch("../php/verificar2FA.php", {
    method: "POST",
    body: formData
  })
    .then(r => r.json())
    .then(data => {

      if (data.status === "success") {

        // 🔥 GUARDAR TOKEN AQUÍ
        if (data.token) {
          localStorage.setItem("token", data.token);
        }

        alert("✅ Verificación completada. Accediendo...");

        // 🔥 Redirigir ahora que ya hay token
        window.location.href = "auxiliar.html";
      } else {
        alert("Código incorrecto.");
      }
    })
    .catch(() => {
      alert("Error al verificar el código.");
    });
}
