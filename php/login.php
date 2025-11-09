<?php
header('Content-Type: application/json');
require 'conexion.php';
require '../vendor/autoload.php'; // Esto es para utilizar Composer con el JWT

use Firebase\JWT\JWT; // Carpetas necesarias para usar JWT
use Firebase\JWT\Key; // Carpetas necesarias para usar JWT

$secret_key = "123"; // clave secreta para el token


// Verificar que se recibieron los datos
if (!isset($_POST['usuario']) || !isset($_POST['password'])) {
    echo json_encode(["status" => "error", "message" => "Datos incompletos"]);
    exit;
}

$numeroControl = $_POST['usuario'];
$password = $_POST['password'];

// Preparar consulta segura
$stmt = $conn->prepare("SELECT id_Estado, numeroControl, Clave FROM Usuarios WHERE numeroControl = ? and id_estado = 1");
$stmt->bind_param("i", $numeroControl);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows === 0) {
    echo json_encode(["status" => "error", "message" => "⚠️ Usuario no encontrado"]);
    exit;
}

$row = $result->fetch_assoc();
$hash = $row['Clave'];

// Verificar contraseña
if (password_verify($password, $hash)) {

    
    // Datos que guarda para el JWT
    $payload = [
        "iss" => "http://localhost:3000/DS/php/login.php",
        "aud" => "http://localhost:3000/DS/Auxi/auxiliar.html",
        "iat" => time(),
        "exp" => time() + (60 * 60),
        "data" => [
            "id" => $row['id_Estado'],
            "numeroControl" => $row['numeroControl'],
        ]
    ];

    $jwt = JWT::encode($payload, $secret_key, 'HS256'); // crea el token
    

    echo json_encode(["status" => "success", "message" => "✅ Login exitoso", "token" => $jwt]);
} else {
    echo json_encode(["status" => "error", "message" => "❌ Contraseña incorrecta"]);
}

$stmt->close();
$conn->close();
?>
