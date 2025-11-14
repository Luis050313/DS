 <?php
 require '../vendor/autoload.php';

 use Endroid\QrCode\Color\Color;
 use Endroid\QrCode\Encoding\Encoding;
 use Endroid\QrCode\ErrorCorrectionLevel;
 use Endroid\QrCode\QrCode;
 use Endroid\QrCode\RoundBlockSizeMode;
 use Endroid\QrCode\Writer\PngWriter;

 $writer= new PngWriter();

 $qrCode = new QrCode(
    data: "http://localhost/ds/",
    encoding: new Encoding('UTF-8'),
    errorCorrectionLevel: ErrorCorrectionLevel::Low,
    size: 300, 
    margin: 10, 
    roundBlockSizeMode: RoundBlockSizeMode::Margin,
    foregroundColor: new Color(0, 0 ,0),
    backgroundColor: new Color(255, 255, 255)
 );

 $resultado = $writer->write($qrCode);

 $imagenQR = base64_encode($resultado->getString());
 ?>

 <img src="data::image/png;base64 , <?= $imagenQR ?>"  alt= "">