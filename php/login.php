<?php

require_once __DIR__.'/DBService.php';
require_once __DIR__.'/passwordHash.php';
require_once __DIR__.'/MailService.php';
require_once __DIR__.'/init_auth.php';

function loginWithRememberMe() {

  global $authenticator, $conn;

  $userIsLogged = false;

  if(!empty($_SESSION['username'])) {
    if(!empty($_POST['logout'])) {
      $authenticator->clearCookie($_SESSION['username']);
      redirect(true);
    }

    if(!empty($_POST['completelogout'])) {
      $storage->cleanAllTriplets($_SESSION['username']);
      redirect(true);
    }

    // Check, if the Rememberme cookie exists and is still valid.
    // If not, we log out the current session
    if(!empty($_COOKIE[$authenticator->getCookieName()])) {
      if (!$authenticator->cookieIsValid()) {
        redirect(true);//logout and continue with the site where it is
      } else {
        $userIsLogged = true;
      }
    }
  } else {
    // If we are not logged in, try to log in via Rememberme cookie
    // If we can present the correct tokens from the cookie, we are logged in
    $loginresult = $authenticator->loginViaCookies();
    if($loginresult) {
      $_SESSION['username'] = $loginresult;
      // There is a chance that an attacker has stolen the login token, so we store
      // the fact that the user was logged in via RememberMe (instead of login form)
      $_SESSION['remembered_by_cookie'] = true;
      $userIsLogged = true;
    } else {
      // If $rememberMe returned false, check if the token was invalid
      if($authenticator->loginTokenWasInvalid()) {
        //$content = tpl("cookie_was_stolen");//TODO do something about it
      }
    }
  }

  //Finally, if there is username in Session, then use it to load the other user data
  if(!empty($_SESSION['username']) && $userIsLogged) {
    
      $email = $_SESSION['username'];
      $sql = "SELECT email, roles FROM users WHERE email='$email'";

      $res = $conn->query($sql);
      $row = $res->fetch(\PDO::FETCH_ASSOC);
      $user = new stdClass();
      $user->id = session_id();
      $user->email = $row['email'];
      $user->roles = $row['roles'];

      set_result('200', 'OK', json_encode($user));
  } else {
    set_result('401', 'no valid token found');
  }
}

function resetPassword() {
  global $authenticator, $conn;
  $email = $_POST ["email"];
  $sql = "SELECT email FROM users WHERE email='$email'";
  $result = $conn->query($sql);
  $success = false;
  if ($result->rowCount() > 0) {
    $newPassword = passwordHash::generate_password(6);
    $sql = "UPDATE users SET password = ? where email = ?";
    $query = $conn->prepare($sql);
    $query->execute(array(passwordHash::hash($newPassword), $email));
    
    MailService::sendPasswordMail($email, $newPassword);
    
    set_result('200', 'OK');
  } else {
    set_result('401', 'no user with such email');
  }
}

function loginWithCredentials() {
  global $authenticator, $conn;
  
  $email = $_POST ["email"];
  $password = isset ( $_POST ['password'] ) ? $_POST ["password"] : null;
  $rememberMe = isset ( $_POST ['rememberme'] ) ? $_POST ["rememberme"] == "true" : false;
  
  $sql = "SELECT email, password, roles FROM users WHERE email='$email'";
  $result = $conn->query($sql);
  $success = false;
  if ($result->rowCount() > 0) {
    $row = $result->fetch(\PDO::FETCH_ASSOC);
    if(passwordHash::check_password($row["password"], $password)) {
      //credentials ok
      session_regenerate_id();
      $_SESSION['username'] = $email;
      // If the user wants to be remembered, create Rememberme cookie
      if($rememberMe) {
        $authenticator->createCookie($email);
      } else {
        $authenticator->clearCookie();
      }
      
      $user = new stdClass();
      $user->id = session_id();
      $user->email = $email;
      $user->roles = $row["roles"];
      
      set_result('200', 'OK', json_encode($user));
      
      $success = true;
      //DONE
    }
    
  }
  if (!$success) {
    set_result('401', 'Incorrect username or password');
  }
  
}


//SCRIPT STARTS HERE

session_start();

if(!empty($_POST)) {
  if (isset ( $_POST ['email'] )) {
    if (isset ( $_POST ['resetPassword'] )) {
      resetPassword();
    } else {
      loginWithCredentials();
    }
  } else {
    loginWithRememberMe();
  }
}


  
?>
