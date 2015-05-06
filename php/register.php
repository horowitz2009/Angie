<?php
require_once __DIR__ . '/DBService.php';
require_once __DIR__ . '/passwordHash.php';
require_once __DIR__ . '/init_auth.php';

function register() {
  global $conn;
  
  $email = $_POST["email"];
  $password = $_POST["password"];
  
  $hashedPass = passwordHash::hash($password);
  $sql = "SELECT email FROM users WHERE email='$email'";
  $result = $conn->query($sql);
  if ($result->rowCount() > 0) {
    set_result('401', 'User already exists');
  } else {
    $sql = "INSERT INTO users(email, password, roles) VALUES ('$email', '$hashedPass', 'shopper')";
    $result = $conn->exec($sql);
    if ($result == 1) {
      set_result('200', 'OK');
    } else {
      set_result('401', 'Something went wrong');
    }
  }
}

// SCRIPT STARTS HERE

session_start();

if (! empty($_POST) && isset($_POST['email']) && isset($_POST['password'])) {
  register();
} else {
  set_result('401', 'missing user data');
}

?>
