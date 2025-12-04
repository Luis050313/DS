<?php
include("conexion.php");

$usuario        = $conn->real_escape_string($_POST['usuario'] ?? '');
$passwordActual = $_POST['passwordActual'] ?? '';
$passwordNueva  = $_POST['passwordNueva'] ?? '';

if ($usuario == "" || $passwordActual == "" || $passwordNueva == "") {
    echo "⚠️ Faltan datos.";
    exit;
}

// 1. Buscar usuario
$sql = $conn->query("SELECT Clave FROM usuarios WHERE numeroControl = '$usuario' AND id_Estado = 1");

if ($sql->num_rows == 0) {
    echo "❌ Usuario no encontrado o inactivo.";
    exit;
}

$row = $sql->fetch_assoc();
$claveHash = $row["Clave"];

// 2. Validar contraseña actual
if (!password_verify($passwordActual, $claveHash)) {
    echo "❌ La contraseña actual es incorrecta.";
    exit;
}

// 3. Generar hash de la nueva contraseña
$nuevoHash = password_hash($passwordNueva, PASSWORD_DEFAULT);

// 4. Actualizar
$update = $conn->query("UPDATE usuarios SET Clave='$nuevoHash' WHERE numeroControl='$usuario'");

if ($update) {
    echo "✅ Contraseña actualizada correctamente.";
} else {
    echo "⚠️ No se pudo actualizar la contraseña.";
}

$conn->close();