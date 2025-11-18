<?php
// Contraseña original (normalmente viene de un formulario)
$password = "1234";

// Generar el hash usando el algoritmo por defecto (bcrypt o argon2 según tu PHP)
$hash = password_hash($password, PASSWORD_DEFAULT);

// Mostrar el hash
echo "Hash generado: " . $hash;
?>