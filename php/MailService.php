<?php

class MailService {

  public static function sendPasswordMail($email, $newPassword) {
    $subject = "Нова парола";
    $txt = "Здравейте, \n".
           "Новата Ви парола е: ".$newPassword."\n";
    $headers = "From: contact@felt-bg.com" . "\r\n";
    mail($email, $subject, $txt, $headers);
  }

  public static function sendMail($email, $subject, $txt) {
    $headers = "From: contact@felt-bg.com" . "\r\n";
    mail($email, $subject, $txt, $headers);
  }

}

?>
