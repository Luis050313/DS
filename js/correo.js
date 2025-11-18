document.getElementById("btnModificar").addEventListener("click", async function () {

    const codigo = Math.floor(100000 + Math.random() * 900000);

    const respuesta = await fetch("../php/enviar_codigo.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ codigo })
    });

    const resultado = await respuesta.json();

    if (resultado.status !== "ok") {
        alert("Error enviando el correo: " + resultado.mensaje);
        return;
    }

    alert("Se envió un código al correo registrado.");

    const codigoIngresado = prompt("Introduce el código enviado:");

    if (codigoIngresado != codigo) {
        alert("Código incorrecto.");
        return;
    }

    const nuevoCorreo = prompt("Introduce el nuevo correo:");
    const nuevoTelefono = prompt("Introduce el nuevo teléfono:");

    document.getElementById("correo").innerText = "Correo: " + nuevoCorreo;
    document.getElementById("telefono").innerText = "Teléfono: " + nuevoTelefono;

    alert("Datos actualizados correctamente.");
});
