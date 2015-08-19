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
  public function saveAccount($username, $oldUsername, $data, $newPassword = null) {
    if ($username != $oldUsername) {
      $sql = "SELECT email FROM users WHERE email = ? LIMIT 1";
      $query = $this->connection->prepare($sql);
      $query->execute(array($username));
      if ($query->fetchColumn()) {
        return false; //new username is already in use
      }
    }
    
    $sql = "UPDATE users SET email = ?, data = ?";
    if ($newPassword != null)
      $sql = $sql.", password = ?";
      
    $sql = $sql." where email = ?";
    $query = $this->connection->prepare($sql);
    if ($newPassword != null)
      $query->execute(array($username, $data, $newPassword, $oldUsername));
    else
      $query->execute(array($username, $data, $oldUsername));
    return true;
  }

  public function saveNewAccount($username, $password, $roles, $data) {
    //INSERT INTO `users`(`email`, `password`, `roles`, `data`, `created`) VALUES ([value-1],[value-2],[value-3],[value-4],[value-5])
    $sql = "INSERT INTO users(`email`, `password`, `roles`, `data`) VALUES (?, ?, ?, ?)";

    $query = $this->connection->prepare($sql);
    $query->execute(array($username, $password, $roles, $data));
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
