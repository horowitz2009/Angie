<?php
require_once __DIR__ . '/RememberMe/Cookie.php';
require_once __DIR__ . '/RememberMe/TokenGenerator.php';

use Birke\Rememberme\Storage\PDOCart;
use Birke\Rememberme\Cookie;
use Birke\Rememberme\TokenGenerator;

class CartService {

  /**
   *
   * @var string
   */
  protected $cookieName = "CART";

  /**
   *
   * @var Cookie
   */
  protected $cookie;

  /**
   *
   * @var TokenGenerator
   */
  protected $tokenGenerator;

  /**
   *
   * @var PDOCart2
   */
  protected $storage;

  /**
   * Number of seconds in the future the cookie and storage will expire (defaults to 1 year)
   *
   * @var int
   */
  protected $expireTime = 31536000;

  public function __construct($storage, $tokenGenerator = null) {
    $this->storage = $storage;
    $this->cookie = new Cookie();
    if ($tokenGenerator != null)
      $this->tokenGenerator = $tokenGenerator;
    else
      $this->tokenGenerator = new TokenGenerator();
  }

  /**
   *
   * @return string
   */
  public function getCookieName() {
    return $this->cookieName;
  }

  /**
   *
   * @param
   *          $name
   * @return $this
   */
  public function setCookieName($name) {
    $this->cookieName = $name;
    return $this;
  }

  /**
   *
   * @param Cookie $cookie          
   * @return $this
   */
  public function setCookie($value, $expires = -1) {
    $exp = $expires;
    if ($exp == - 1) {
      $exp = time() + $this->expireTime;
    }
    $this->cookie->setCookie($this->getCookieName(), $value, $exp);
    return $this;
  }

  /**
   *
   * @return array
   */
  public function getCookieValues() {
    // Cookie was not sent with incoming request
    if (empty($_COOKIE[$this->cookieName])) {
      return array();
    }
    
    $cookieValues = explode("|", $_COOKIE[$this->cookieName], 2);
    
    if (count($cookieValues) < 2) {
      return array();
    }
    
    return $cookieValues;
  }

  /**
   * Return how many seconds in the future that the cookie will expire
   *
   * @return int
   */
  public function getExpireTime() {
    return $this->expireTime;
  }

  /**
   *
   * @param int $expireTime
   *          How many seconds in the future the cookie will expire
   *          
   *          Default is 604800 (1 week)
   *          
   * @return Authenticator
   */
  public function setExpireTime($expireTime) {
    $this->expireTime = $expireTime;
    
    return $this;
  }

  public function findCartToken() {
    $cookieValues = $this->getCookieValues();
    if ($cookieValues != null) {
      $result = $this->storage->findToken($cookieValues[0], $cookieValues[1] . $this->tokenGenerator->getSalt());
      if ($result == 1) {
        return $cookieValues[1];
      }
    }
    return null;
  }

  public function saveCart($username, $cart) {
    $token = $this->findCartToken();
    
    $exp = time() + $this->getExpireTime();
    
    if ($token == null) {
      $token = $this->tokenGenerator->generate();
      $this->setCookie(implode("|", array(
        $username,
        $token
      )), $exp);
      $this->storage->storeToken($username, $token . $this->tokenGenerator->getSalt(), $exp);
    }
    
    $this->storage->saveCart($username, $token . $this->tokenGenerator->getSalt(), $cart, $exp);
    $this->setCookie(implode("|", array(
      $username,
      $token
    )), $exp);
  }

  public function loadCart($username) {
    $cart = null;
    $token = $this->findCartToken();
    if ($token != null)
      $cart = $this->storage->loadCart($username, $token . $this->tokenGenerator->getSalt());
    return $cart;
  }
}