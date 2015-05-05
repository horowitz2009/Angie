<?php
namespace Birke\Rememberme;

class TokenGenerator {

  /**
   * Additional salt to add more entropy when the tokens are stored as hashes.
   * 
   * @var string
   */
  protected $salt = "";

  function __construct($salt = "") {
    $this->salt = $salt;
  }

  /**
   * Create a pseudo-random token.
   *
   * The token is pseudo-random. If you need better security, read from /dev/urandom
   */
  public function generate() {
    return md5(uniqid(mt_rand(), true));
  }

  /**
   *
   * @return string
   */
  public function getSalt() {
    return $this->salt;
  }

  /**
   * The salt is additional information that is added to the tokens to make
   * them more unqiue and secure.
   * The salt is not stored in the cookie and
   * should not saved in the storage.
   *
   * For example, to bind a token to an IP address use $_SERVER['REMOTE_ADDR'].
   * To bind a token to the browser (user agent), use $_SERVER['HTTP_USER_AGENT].
   * You could also use a long random string that is uniqe to your application.
   * 
   * @param string $salt          
   */
  public function setSalt($salt) {
    $this->salt = $salt;
  }
}
