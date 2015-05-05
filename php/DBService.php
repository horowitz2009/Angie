<?php

// const SERVERNAME = "localhost";
class DBService {

  private $servername = "localhost";

  private $username = "zhristov";

  private $password = "totaasha";

  private $db = "felt";
  
  // Create connection
  public function createConnection() {
    return new mysqli ( $this->servername, $this->username, $this->password, $this->db );
  }
}

?>