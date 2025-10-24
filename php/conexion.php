<?php
$servidor = "localhost";
$usuario = "root";
$password = "root";
$base_datos = "laboratorio_electronica";

// Crear conexión
$conn = new mysqli($servidor, $usuario, $password, $base_datos);

// Verificar conexión
if ($conn->connect_error) {
    die(json_encode(["status" => "error", "message" => "Error de conexión a la base de datos"]));
}

// Configurar charset
$conn->set_charset("utf8");
?>
