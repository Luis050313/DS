// --- Referencias ---
const usuarioInput = document.getElementById("usuario");
const passActualInput = document.getElementById("passwordActual");
const passNuevaInput = document.getElementById("passwordNueva");
const btnCambiar = document.querySelector("button");

// INICIALMENTE DESACTIVADO
btnCambiar.disabled = true;

// --- Validación de contraseña fuerte ---
function validarPasswordFuerte(pass) {
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&._-])[A-Za-z\d@$!%*?&._-]{8,}$/;
    return regex.test(pass);
}

// --- Evaluar si se puede habilitar el botón ---
function validarFormulario() {

    const usuario = usuarioInput.value.trim();
    const actual = passActualInput.value.trim();
    const nueva = passNuevaInput.value.trim();

    // Si faltan campos → botón OFF
    if (usuario === "" || actual === "" || nueva === "") {
        btnCambiar.disabled = true;
        return;
    }

    // Validación fuerte de la nueva contraseña
    if (!validarPasswordFuerte(nueva)) {
        btnCambiar.disabled = true;
        return;
    }

    // SI TODO ES VÁLIDO → activar
    btnCambiar.disabled = false;
}

// --- Listeners para validar en tiempo real ---
[usuarioInput, passActualInput, passNuevaInput].forEach(input => {
    input.addEventListener("input", validarFormulario);
});

// --- Función principal ---
function cambiarContrasena() {

    const usuario = usuarioInput.value.trim();
    const passwordActual = passActualInput.value.trim();
    const passwordNueva = passNuevaInput.value.trim();

    if (usuario === "" || passwordActual === "" || passwordNueva === "") {
        mostrarMensaje("⚠️ Llene todos los campos");
        return;
    }

    // Seguridad extra del lado cliente (como en Usuarios-LAGP)
    if (!validarPasswordFuerte(passwordNueva)) {
        mostrarMensaje("⚠️ La nueva contraseña no cumple con los requisitos:<br>• Una mayúscula<br>• Una minúscula<br>• Un número<br>• Un carácter especial<br>• Mínimo 8 caracteres");
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

        mostrarMensaje(data);

        // Si cambió correctamente → limpiar campos
        if (data.includes("actualizada correctamente")) {
            usuarioInput.value = "";
            passActualInput.value = "";
            passNuevaInput.value = "";

            btnCambiar.disabled = true;
        }

    })
    .catch(err => {
        mostrarMensaje("⚠️ Error en la conexión");
    });
}
