<?php

require_once 'php/DBService.php';
require_once 'php/passwordHash.php';
include 'php/init_auth.php';

if(!empty($_POST)) {

  $email = isset ( $_POST ['email'] ) ? $_POST ["email"] : null;
  $password = isset ( $_POST ['password'] ) ? $_POST ["password"] : null;
  $rememberMe = isset ( $_POST ['rememberme'] ) ? $_POST ["rememberme"] : null;
////////////////
  $dbService = new DBService();
  $conn = null;
  $loginresult = false;
  try {
    $conn = $dbService->createConnection();
  
    if (mysqli_connect_error()) {
      throw new Exception("No connection could be made because the target machine actively refused it!");
    }
  
    $sql = "SELECT email, password, roles FROM users WHERE email='$email'";
    $result = $conn->query($sql);
  
    if ($result->num_rows > 0) {
      //we have email. good. now let's check the password
      $row = $result->fetch_assoc();
      $dbpassword = $row["password"];
      if(passwordHash::check_password($dbpassword, $password)){
        //SUCCESS
        //header('Content-type: application/json');
        $loginresult = true;
        header('HTTP/1.1 200 OK');
        header('Content-Type: application/json; charset=UTF-8');
        
        session_regenerate_id();
        $_SESSION['username'] = $email;
        // If the user wants to be remembered, create Rememberme cookie
        if(!empty($_POST['rememberme'])) {
          $authenticator->createCookie($email);
        } else {
          $authenticator->clearCookie();
        }
        
        //TODO return better obj
        $obj = new stdClass();
        $obj->id = session_id();
        $obj->email = $email;
        $obj->roles = $row["roles"];
        
        echo json_encode($obj);
        
        
      }
    } 
//         if (true) {
//           $hashedPass = passwordHash::hash($password);
//           $sql = "SELECT email, password FROM users WHERE email='$email'";
//           $result = $conn->query($sql);
//           $sql = "UPDATE users SET password='$hashedPass' WHERE email='$email'";
  
//           if ($conn->query ( $sql ) === TRUE) {
//             echo "Record updated successfully";
//           } else {
//             echo "Error updating record: " . $conn->error;
//           }
  
//         }
  
      
     
  } catch (Exception $e) {
    if ($conn != null)
      try {
      $conn->close();
    } catch (Exception $e2) {
      // do nothing for now
    }
    //still need to rethrow the exception
    throw new Exception($e->getMessage(), $e->getCode(), $e);
  }
  
  try {
    $conn->close();
  } catch (Exception $e2) {
    // do nothing for now
  }
  
  if (!$loginresult) {
    $msg = "Incorrect username or password";
    header('HTTP/1.1 401 ' . $msg);
    header('Content-Type: application/json; charset=UTF-8');
  }
  
}//not empty POST
  
?>
