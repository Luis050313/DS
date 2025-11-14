<?php
header('Content-Type: application/json');
require 'conexion.php';
require '../vendor/autoload.php';
use Firebase\JWT\JWT;
use Firebase\JWT\Key;
use Endroid\QrCode\QrCode;
use Endroid\QrCode\Writer\PngWriter;
use Endroid\QrCode\Encoding\Encoding;
use Endroid\QrCode\ErrorCorrectionLevel;
use Endroid\QrCode\RoundBlockSizeMode;
use Endroid\QrCode\Color\Color;

$secret_key = "123";

if (!isset($_POST['usuario']) || !isset($_POST['password'])) {
    echo json_encode(["status" => "error", "message" => "Datos incompletos"]);
    exit;
}

$numeroControl = $_POST['usuario'];
$password = $_POST['password'];

$stmt = $conn->prepare("SELECT id_Estado, numeroControl, Clave FROM Usuarios WHERE numeroControl = ?");
$stmt->bind_param("i", $numeroControl);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows === 0) {
    echo json_encode(["status" => "error", "message" => "⚠️ Usuario no encontrado"]);
    exit;
}

$row = $result->fetch_assoc();
$hash = $row['Clave'];

if (password_verify($password, $hash)) {

    // --- Generar token de sesión ---
    $payload = [
        "iss" => "http://localhost/DS/php/login.php",
        "aud" => "http://localhost/DS/Auxi/auxiliar.html",
        "iat" => time(),
        "exp" => time() + (60 * 60),
        "data" => [
            "id" => $row['id_Estado'],
            "numeroControl" => $row['numeroControl'],
        ]
    ];

    $jwt = JWT::encode($payload, $secret_key, 'HS256');

    // --- Generar código temporal de validación (2FA) ---
    $codigo2FA = rand(100000, 999999);

    // Podrías guardarlo en sesión o DB temporalmente
    session_start();
    $_SESSION['codigo2FA'] = $codigo2FA;
    $_SESSION['jwt'] = $jwt;

    // --- Crear QR con el código ---
    $writer = new PngWriter();
    $qrCode = new QrCode(
        data: "Código de verificación: $codigo2FA",
        encoding: new Encoding('UTF-8'),
        errorCorrectionLevel: ErrorCorrectionLevel::Low,
        size: 300,
        margin: 10,
        roundBlockSizeMode: RoundBlockSizeMode::Margin,
        foregroundColor: new Color(0, 0, 0),
        backgroundColor: new Color(255, 255, 255)
    );

    $resultado = $writer->write($qrCode);
    $imagenQR = base64_encode($resultado->getString());

    echo json_encode([
        "status" => "2FA",
        "message" => "Se requiere validación 2FA",
        "qr" => "data:image/png;base64," . $imagenQR
    ]);

} else {
    echo json_encode(["status" => "error", "message" => "❌ Contraseña incorrecta"]);
}

$stmt->close();
$conn->close();
?>