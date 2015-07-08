<?php
/**
 * This file demonstrates how to use the Rememberme library.
 *
 * Some code (autoload, templating) is just simple boilerplate and no shining
 * example of how to write php applications.
 *
 * @author Gabriel Birke
 */
require_once __DIR__.'/DBService.php';
require_once __DIR__.'/Rememberme/Authenticator.php';
require_once __DIR__.'/Rememberme/Storage/PDO.php';


use Birke\Rememberme;

/**
 * Helper function for redirecting and destroying the session
 * @param bool $destroySession
 * @return void
 */
function redirect($destroySession=false) {
  if($destroySession) {
    session_regenerate_id(true);
    session_destroy();
  }
  header("Location: index.php");
  exit;
}

// Normally you would store the credentials in a DB
$username = "zhristov@gmail.com";
$password = "demo";

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


$authenticator = new Rememberme\Authenticator($storage);

// First, we initialize the session, to see if we are already logged in
session_start();

/* Secure against Session Hijacking by checking user agent */
if (isset($_SESSION['HTTP_USER_AGENT'])) {
  if ($_SESSION['HTTP_USER_AGENT'] != md5($_SERVER['HTTP_USER_AGENT'])) {
    $this->signout();
    exit;
  }
}

if(!empty($_SESSION['username'])) {
  if(!empty($_GET['logout'])) {
    $authenticator->clearCookie($_SESSION['username']);
    redirect(true);
  }

  if(!empty($_GET['completelogout'])) {
    $storage->cleanAllTriplets($_SESSION['username']);
    redirect(true);
  }

  // Check, if the Rememberme cookie exists and is still valid.
  // If not, we log out the current session
  if(!empty($_COOKIE[$authenticator->getCookieName()]) && !$authenticator->cookieIsValid()) {
    redirect(true);//logout and continue with the site where it is
  }

  // User is still logged in - show content
  $content = tpl("user_is_logged_in");
  //TODO get the user data
  
}
// If we are not logged in, try to log in via Rememberme cookie
else {
  // If we can present the correct tokens from the cookie, we are logged in
  $loginresult = $authenticator->login();
  if($loginresult) {
    $_SESSION['username'] = $loginresult;
    // There is a chance that an attacker has stolen the login token, so we store
    // the fact that the user was logged in via RememberMe (instead of login form)
    $_SESSION['remembered_by_cookie'] = true;
    redirect();//TODO NO NEED
  }
  else {
    // If $rememberMe returned false, check if the token was invalid
    if($authenticator->loginTokenWasInvalid()) {
      $content = tpl("cookie_was_stolen");//TODO do something about it
    }
    // $rememberMe returned false because of invalid/missing Rememberme cookie - normal login process
    //LOGIN HERE
    else {
      if(!empty($_POST)) {
        if($username == $_POST['username'] && $password == $_POST['password']) {
          session_regenerate_id();
          $_SESSION['username'] = $username;
          // If the user wants to be remembered, create Rememberme cookie
          if(!empty($_POST['rememberme'])) {
            $authenticator->createCookie($username);
          }
          else {
            $authenticator->clearCookie();
          }
          redirect();
        }
        else {
          $content = tpl("login", "Invalid credentials");
        }
      }
      else {
        $content = tpl("login");
      }
    }
  }
}

// template function for including content, nothing interesting
function tpl($template, $msg="") {
  $fn = __DIR__ . DIRECTORY_SEPARATOR . "templates" . DIRECTORY_SEPARATOR . $template . ".php";
  if(file_exists($fn)) {
    ob_start();
    include $fn;
    return ob_get_clean();
  }
  else {
    return "Template $fn not found";
  }
}