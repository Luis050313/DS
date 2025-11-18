<?php
session_start();
header("Content-Type: application/json");

// Validar que venga el código
if (!isset($_POST['codigo'])) {
    echo json_encode(["status" => "error", "message" => "Código faltante"]);
    exit;
}

// Validar que exista el código en la sesión
if (!isset($_SESSION['codigo2FA'])) {
    echo json_encode(["status" => "error", "message" => "No hay código generado"]);
    exit;
}

$codigoIngresado = $_POST['codigo'];

// Comparar códigos
if ($codigoIngresado == $_SESSION['codigo2FA']) {
    echo json_encode([
        "status" => "success",
        "message" => "2FA validado correctamente",
        "token" => $_SESSION['jwt']
    ]);
} else {
    echo json_encode(["status" => "error", "message" => "❌ Código incorrecto"]);
}
?>