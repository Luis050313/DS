<?php
// Este codigo es para validar el JWT en el LOGIN

require '../vendor/autoload.php';
use Firebase\JWT\JWT;
use Firebase\JWT\Key;

$secret_key = "123"; // Es la misma clave que en login.php

$headers = apache_request_headers();

if(!isset($headers['Authorization'])){
    echo json_encode(["status" => "error", "message" => "⛔ Token no enviado"]);
    exit;
}

$token = str_replace('Bearer ', '', $headers['Authorization']);

try {
    $decoded = JWT::decode($token, new Key($secret_key, 'HS256'));
    echo json_encode(["status" => "success", "message" => "Token válido"]);
} catch (Exception $e) {
    echo json_encode(["status" => "error", "message" => "❌ Token inválido o expirado"]);
}
?>