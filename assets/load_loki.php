<?php
//header ( 'Content-Type: application/json' );

$dbname = $_GET ["dbname"];
$servername = "localhost";
$username = "zhristov";
$password = "totaasha";

// Create connection
$conn = new mysqli ( $servername, $username, $password, "felt" );

// Check connection
if ($conn->connect_error) {
	die ( "Connection failed: " . $conn->connect_error );
}

$stmt = $conn->prepare ( "SELECT data FROM lokidbs where name = '$dbname'" );
$stmt->execute ();
$stmt->store_result ();
$stmt->bind_result ( $value );
$res = $stmt->fetch ();
if ($res) {
	echo $value;
} else {
	echo "";
}

$stmt->close ();
$conn->close ();
?>


