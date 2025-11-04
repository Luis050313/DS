const token = localStorage.getItem("token");  // Comprueba si hay token en localStorage

  if (!token) {
    alert("⛔ Debes iniciar sesión primero");
    window.location.href = "../index.html";
  } else {
    // Verificar token con el servidor
    fetch("../php/ValidarTokenJWT.php", {
      headers: {
        "Authorization": "Bearer " + token
      }
    })
    .then(res => res.json())
    .then(data => {
      if (data.status !== "success") {
        alert("⚠️ Sesión inválida o expirada");
        localStorage.removeItem("token");
        window.location.href = "../index.html";
      }
    })
    .catch(() => {
      alert("Error verificando sesión");
      window.location.href = "../index.html";
    });
  }