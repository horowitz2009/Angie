<!DOCTYPE html>
<html>
<body>

	<h1>My first PHP page</h1>

<?php
$servername = "localhost";
$username = "zhristov";
$password = "totaasha";

/*
 * // Create connection
 * $conn = new mysqli($servername, $username, $password);
 *
 * // Check connection
 * if ($conn->connect_error) {
 * die("Connection failed: " . $conn->connect_error);
 * }
 * echo "Connected successfully";
 *
 */

try {
  $conn = new PDO ( "mysql:host=$servername;dbname=felt", $username, $password );
  // set the PDO error mode to exception
  $conn->setAttribute ( PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION );
  echo "Connected successfully";
} catch ( PDOException $e ) {
  echo "Connection failed: " . $e->getMessage ();
}

$txt1 = "Learn PHP5";
$txt2 = "W3Schools";
$x = 5;
$y = 4;

print ("<h2>$txt1</h2>") ;
print ("Study PHP at $txt2<br>") ;
print ($x + $y) ;

$cars = array (
    1,
    3.14,
    4,
    5 
);
$cars [9] = 99;
var_dump ( $cars );

class Car {

  function Car() {
    $this->model = "BMW";
  }
}

$mycar = new Car ();

$mycar2 = new Car ();

$cars1 = array (
    '12',
    $mycar,
    '15' 
);
$cars2 = array (
    '12',
    $mycar2,
    '15' 
);

echo "are same:" . ($cars1 == $cars2);

$mycar->model = "LANCIA";

echo "<br>";
echo $_SERVER ['PHP_SELF'];
echo "<br>";
echo $_SERVER ['SERVER_NAME'];
echo "<br>";
echo $_SERVER ['HTTP_HOST'];
echo "<br>";
// echo $_SERVER['HTTP_REFERER'];
// echo "<br>";
echo $_SERVER ['HTTP_USER_AGENT'];
echo "<br>";
echo $_SERVER ['SCRIPT_NAME'];

echo "<br>";

$myfile = fopen ( "README.md", "r" ) or die ( "Unable to open file!" );
echo fread ( $myfile, filesize ( "README.md" ) );
fclose ( $myfile );

?>



<?php

function exception_error_handler($severity, $message, $file, $line) {
  if (! (error_reporting () & $severity)) {
    // This error code is not included in error_reporting
    return;
  }
  throw new ErrorException ( $message, 0, $severity, $file, $line );
}
set_error_handler ( "exception_error_handler" );

function inverse($x) {
  // if (!$x) {
  // throw new Exception('Division by zero.');
  // }
  return 1 / $x;
}

try {
  echo inverse ( 5 ) . "<br>";
  echo inverse ( 0 ) . "<br>";
} catch ( ErrorException $e ) {
  echo 'Caught exception: ', $e->getMessage (), "<br>";
}

// Continue execution
echo "Hello World<br>";
?>





</body>
</html>