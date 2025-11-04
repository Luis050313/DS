<?php
$host = "localhost:33061";
$user = "root";
$pass = "";
$db   = "laboratorio_electronica";

$conn = new mysqli($host, $user, $pass, $db);

if ($conn->connect_error) {
    die("Conexión fallida");
}
?>