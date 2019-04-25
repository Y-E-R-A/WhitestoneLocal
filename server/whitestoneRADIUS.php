<?php
echo("Inside PHP.");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: X-Requested-With");
require_once('radius.class.php');
if (isset($_POST)){
echo ("POST is set.");
$uname = $_POST["email"];
$upass = $_POST["password"];

echo($uname);
echo($upass);


$radius = new Radius('radius.uprm.edu'  , 'whitestone');
    if ( (($radius->AccessRequest($uname,$upass))))
        {
            echo ("Success");
        }
    else
        {
            echo ("Failure");
        }


}
