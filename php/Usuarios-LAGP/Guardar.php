<?php
include("../conexion.php");

$id              = $conn->real_escape_string($_POST['id'] ?? '');
$numeroControl   = $conn->real_escape_string($_POST['numeroControl'] ?? '');
$nombre          = $conn->real_escape_string($_POST['nombre'] ?? '');
$apellidoPaterno = $conn->real_escape_string($_POST['apellidoPaterno'] ?? '');
$apellidoMaterno = $conn->real_escape_string($_POST['apellidoMaterno'] ?? '');
$carrera         = $conn->real_escape_string($_POST['carrera'] ?? '');
$clave           = $conn->real_escape_string($_POST['clave'] ?? '');
$correo          = $conn->real_escape_string($_POST['correo'] ?? '');

//
// 1) Buscar si existe en PERSONAS
//
$checkPersona = $conn->query("SELECT id_Estado FROM personas WHERE numeroControl = '$numeroControl'");


//
// Si no existe en ninguna tabla → Insert
//
if($checkPersona->num_rows == 0){

    try{
        if($id == 1 || $id == 2){ // Auxiliar o Alumno
            $conn->query("INSERT INTO personas (numeroControl, id_Rol, id_Estado, nombre, apellidoPaterno, apellidoMaterno, correo)
                           VALUES ('$numeroControl','$id',1,'$nombre','$apellidoPaterno','$apellidoMaterno','$correo')");

            $hash = password_hash($clave, PASSWORD_DEFAULT);
            $stmt = $conn->prepare("INSERT INTO usuarios (id_Estado, numeroControl, Clave) VALUES ('1',?,?)");
            $stmt->bind_param("is", $numeroControl, $hash);
            $stmt->execute();

            if($id == 2){
                $conn->query("INSERT INTO CarrerasAlumnos (numeroControl, id_Carrera) VALUES ('$numeroControl','$carrera')");
            }
        } else{
            echo "Registro inválido";
        }

        echo "Guardado correctamente ✅";

    } catch (mysqli_sql_exception $e){
        echo "⚠️ Error al guardar: " . $e->getMessage();
    }

    $conn->close();
    exit;
}

//
// Si existe → validamos id_estado
//
if($checkPersona->num_rows > 0){
    $row = $checkPersona->fetch_assoc();
}

$idEstado = $row['id_Estado'];

if($idEstado == 1){
    echo "⚠️ Advertencia: Usuario Duplicado (ya está activo).";
} elseif($idEstado == 2){
    include("modificar.php"); // Reactivar / modificar usuario
    echo "-> Usuario Activado ⚡";
} else {
    echo "⚠️ Error: Estado de usuario desconocido ($idEstado).";
}
