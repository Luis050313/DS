<?php
require '../vendor/autoload.php';

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

header("Content-Type: application/json");

// Obtener correo del frontend (si quisieras enviar a varios)
$data = json_decode(file_get_contents("php://input"), true);

// Código recibido desde JS
$codigo = $data['codigo'];

// Correo a donde vaya el código
$correoDestino = "luisagp2005@gmail.com";

$mail = new PHPMailer(true);

try {
    // CONFIGURACIÓN DEL SMTP (Gmail en este ejemplo)
    $mail->isSMTP();
    $mail->Host       = 'smtp.gmail.com';
    $mail->SMTPAuth   = true;
    $mail->Username   = 'luisagp2005@gmail.com';       // <-- CAMBIAR
    $mail->Password   = 'sqkv ngke efzy uekj'; // <-- IMPORTANTE (NO ES LA CONTRASEÑA NORMAL)
    $mail->SMTPSecure = 'tls';
    $mail->Port       = 587;

    // Remitente y destino
    $mail->setFrom('luisagp2005@gmail.com', 'Sistema ITS');
    $mail->addAddress($correoDestino);

    // Contenido
    $mail->isHTML(true);
    $mail->Subject = 'Código de verificación';
    $mail->Body    = "<h2>Tu código es:</h2><h1>$codigo</h1>";

    $mail->send();
    echo json_encode(['status' => 'ok']);
} catch (Exception $e) {
    echo json_encode(['status' => 'error', 'mensaje' => $mail->ErrorInfo]);
}
