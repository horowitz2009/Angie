<?php
require_once __DIR__ . '/AccountService.php';
require_once __DIR__ . '/DBService.php';

function set_result($code, $msg, $result = '{}') {
  header('HTTP/1.1 ' . $code . ' ' . $msg);
  header('Content-Type: application/json; charset=UTF-8');
  echo $result;
}

if (! empty($_POST) && isset($_POST['username'])) {
  
  session_start();
  $db = new DBService();
  $accountService = new AccountService($db->createPDOConnection());
  
  $username = $_POST['username'];
  
  $account = $accountService->loadAccount($username);
  
  if ($account != null) {
    set_result('200', 'OK', $account);
  } else {
    set_result('200', 'EMPTY');
  }
  
} else {
  set_result("500", "Missing arguments");
}

?>