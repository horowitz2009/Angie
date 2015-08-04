<?php

/**
 * All about orders
 *
 * @author Jeff Horowitz
 */
class AccountService {

  /**
   *
   * @var \PDO
   */
  protected $connection;

  public function __construct($connection) {
    $this->connection = $connection;
  }

  /**
   *
   * @param PDO $connection          
   */
  public function setConnection(\PDO $connection) {
    $this->connection = $connection;
  }

  /**
   *
   * @param string $username          
   * @param string $status          
   * @param string $data          
   */
  public function saveAccount($username, $data, $newPassword = null) {
    $sql = "UPDATE users SET data = ?";
    if ($newPassword != null)
      $sql = $sql.", password = ?";
      
    $sql = $sql." where email = ?";
    $query = $this->connection->prepare($sql);
    if ($newPassword != null)
      $query->execute(array($data, $newPassword, $username));
    else
      $query->execute(array($data, $username));
  }

  public function loadAccount($username) {
    $sql = "SELECT data FROM users WHERE email = ?";
    $query = $this->connection->prepare($sql);
    $query->execute(array($username));
    $query->setFetchMode(PDO::FETCH_NUM);
    if ($row = $query->fetch()) {
      return $row[0];
    }
    return null;
  }
  
}
