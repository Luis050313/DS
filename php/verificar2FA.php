<?php
session_start();

if (!isset($_POST['codigo'])) {
    echo json_encode(["status" => "error", "message" => "Código faltante"]);
    exit;
}

if ($_POST['codigo'] == $_SESSION['codigo2FA']) {
    echo json_encode([
        "status" => "success",
        "message" => "✅ Segunda validación completada",
        "token" => $_SESSION['jwt']
    ]);
} else {
    echo json_encode(["status" => "error", "message" => "❌ Código incorrecto"]);
}
?>