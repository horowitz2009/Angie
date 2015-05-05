<?php
// Start the session
session_start();
?>
<!DOCTYPE html>
<html>
<body>

<?php
// Set session variables
$_SESSION["favcolor"] = "green";
$_SESSION["favanimal"] = "cat";
echo var_dump($_SESSION);
echo "Session variables are set.";

echo "sessionID is ".session_id();
?>

</body>
</html>