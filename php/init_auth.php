<?php
require_once __DIR__ . '/Rememberme/TokenGenerator.php';
require_once __DIR__ . '/Rememberme/Authenticator.php';
require_once __DIR__ . '/Rememberme/Storage/PDO.php';
require_once __DIR__ . '/DBService.php';

use Birke\Rememberme;

/**
 * Helper function for redirecting and destroying the session
 *
 * @param bool $destroySession          
 * @return void
 */
function redirect($destroySession = false) {
  if ($destroySession) {
    session_regenerate_id(true);
    session_destroy();
  }
  // header("Location: index.php");
  exit();
}

function set_result($code, $msg, $result = '{}') {
  header('HTTP/1.1 ' . $code . ' ' . $msg);
  header('Content-Type: application/json; charset=UTF-8');
  echo $result;
}

$options = array(
  "credentialColumn" => "credential",
  "expiresColumn" => "expires",
  "tokenColumn" => "token",
  "tableName" => "tokens"
);

$storage = new Rememberme\Storage\PDO($options);
$db = new DBService();
$conn = $db->createPDOConnection();
$storage->setConnection($conn);

$authenticator = new Rememberme\Authenticator($storage, new Rememberme\TokenGenerator("jeff_" . $_SERVER['REMOTE_ADDR'] . $_SERVER['HTTP_USER_AGENT']));

?>
