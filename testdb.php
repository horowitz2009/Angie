<?php
include 'startup.php';
$guid = '';

  function GUID2() {
    $size = mcrypt_get_iv_size(MCRYPT_CAST_256, MCRYPT_MODE_CFB);
    $iv = mcrypt_create_iv($size, MCRYPT_DEV_RANDOM);
    return $iv;
  }
  
  function GUID() {
    if (function_exists('com_create_guid') === true)
    {
        return trim(com_create_guid(), '{}');
    }

    return sprintf('%04X%04X-%04X-%04X-%04X-%04X%04X%04X', mt_rand(0, 65535), mt_rand(0, 65535), mt_rand(0, 65535), mt_rand(16384, 20479), mt_rand(32768, 49151), mt_rand(0, 65535), mt_rand(0, 65535), mt_rand(0, 65535));
}



if(!isset($_COOKIE["FELT_GUID"])) {
  //setcookie("FELT_GUID", GUID(), time() + (86400 * 7), "/"); // 86400 = 1 day * 7 => week
  setcookie("FELT_GUID", GUID(), time() + (60), "/"); // 86400 = 1 day * 7 => week
} else {
  $guid = $_COOKIE["FELT_GUID"];
}



?>

<!DOCTYPE html>
<html>
<head>
<script src="app/bower_components/jquery/dist/jquery.js"></script>
<script src="js/jquery.cookie.js"></script>

<script>
  var i = 0;
  
  function load_cart() {

  }

  function save_cart() {
	  
	  //var session_cookie = $.cookie("FELT_SESSION");
	  $("#output").text("");
	  
	  $.ajax({
			type : "POST",
			url : 'php/save_cart.php',
			data : {
				data : "{'name': 'loki db goes here " + i++ + "'}",
				username: null //,				session_id: session_cookie
			},
			success : function(resp) {
				        $("#output").html(resp);
				      },
			error : function(resp, status, err) {
				        console.log(resp);
				        console.log(status);
				        console.log(err);
				        $("#output").text(err);
			          }
		});
  
  }

</script>
</head>


<body>

	<h1>PHP TEST DB CONNECTION</h1>

<?php

echo 'Session id: ' . session_id();
echo 'GUID: ' . $guid;
?>

<button onclick="save_cart()">save</button>

	<div id="output"></div>







</body>
</html>