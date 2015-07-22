<?php
require_once __DIR__ . '/AccountService.php';
require_once __DIR__ . '/DBService.php';

function set_result($code, $msg, $result = '{}') {
  header('HTTP/1.1 ' . $code . ' ' . $msg);
  header('Content-Type: application/json; charset=UTF-8');
  echo $result;
}

if (! empty($_POST) && isset($_POST['username']) && isset($_POST['data'])) {
  
  session_start();
  $db = new DBService();
  $accountService = new AccountService($db->createPDOConnection());
  
  $username = $_POST['username'];
  $data = $_POST['data'];
  
  $accountService->saveAccount($username, $data);
  
  set_result('200', 'OK');
} else {
  set_result("500", "Missing arguments");
}

?>