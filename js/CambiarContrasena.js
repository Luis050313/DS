function cambiarContrasena() {
    const usuario = document.getElementById("usuario").value.trim();
    const passwordActual = document.getElementById("passwordActual").value.trim();
    const passwordNueva = document.getElementById("passwordNueva").value.trim();

    if (usuario === "" || passwordActual === "" || passwordNueva === "") {
        mostrarMensaje("⚠️ Llene todos los campos");
        return;
    }

    const formData = new FormData();
    formData.append("usuario", usuario);
    formData.append("passwordActual", passwordActual);
    formData.append("passwordNueva", passwordNueva);

    fetch("php/CambiarContrasena.php", {
        method: "POST",
        body: formData
    })
    .then(res => res.text())
    .then(data => {
        mostrarMensaje(data); // según tu proyecto
    })
    .catch(err => {
        mostrarMensaje("⚠️ Error en la conexión");
    });
}