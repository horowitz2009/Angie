<?php

require_once __DIR__ . '/Rememberme/TokenGenerator.php';
require_once __DIR__ . '/Rememberme/Authenticator.php';
require_once __DIR__ . '/Rememberme/Storage/PDO.php';

require_once __DIR__ . '/AccountService.php';
require_once __DIR__ . '/DBService.php';
require_once __DIR__ . '/passwordHash.php';

function set_result($code, $msg, $result = '{}') {
  header('HTTP/1.1 ' . $code . ' ' . $msg);
  header('Content-Type: application/json; charset=UTF-8');
  echo $result;
}

if (! empty($_POST) && isset($_POST['username']) && isset($_POST['data'])) {
  
  session_start();
  $db = new DBService();
  $conn = $db->createPDOConnection();
  $accountService = new AccountService($conn);

  $username = $_POST['username'];
  $oldUsername = $_POST['oldUsername'];
  $data = $_POST['data'];
  $newPassword = (isset($_POST['oldPassword']) || isset($_POST['newAccount'])) && isset($_POST['newPassword']) ? passwordHash::hash($_POST['newPassword']) : null;
  
  $success = true;
  
  if (isset($_POST['oldPassword']) && strlen($_POST['oldPassword']) > 0) {
    $success = false;
    $oldPassword = $_POST['oldPassword'];
  
    $sql = "SELECT email, password, roles FROM users WHERE email='$oldUsername'";
    $result = $conn->query($sql);
    if ($result->rowCount() > 0) {
      $row = $result->fetch(\PDO::FETCH_ASSOC);
      if(passwordHash::check_password($row["password"], "".$oldPassword)) {
        $success = true;
      }
    }
  }
  $res = true;
  if ($success) {
    if (isset($_POST['newAccount'])) {
      $accountService->saveNewAccount($username, $newPassword, 'shopper', $data);
    } else {
      $res = $accountService->saveAccount($username, $oldUsername, $data, $newPassword);
      if ($res && $username != $oldUsername) {
        //need to update the rememberme token if any
        $storage = new Birke\Rememberme\Storage\PDO();
        $storage->setConnection($conn);
        
        $authenticator = new Birke\Rememberme\Authenticator($storage, new Birke\Rememberme\TokenGenerator("jeff_" . $_SERVER['REMOTE_ADDR'] . $_SERVER['HTTP_USER_AGENT']));
        
        if(!empty($_COOKIE[$authenticator->getCookieName()])) {
          $_SESSION['username'] = $username;
          $authenticator->clearCookie();
          $authenticator->createCookie($username);
        }
      }
    } 
    
    if ($res)
      set_result('200', 'OK');
    else
      set_result('409', 'E-mail not available');
    
  } else {
    set_result('401', 'Incorrect password');
  }
} else {
  set_result("500", "Missing arguments");
}

?>