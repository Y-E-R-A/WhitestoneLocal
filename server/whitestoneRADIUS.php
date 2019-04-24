<?php

require_once('radius.class.php');

$uname = $_POST["uname"];
$upass = $_POST["upass"];


$radius = new Radius('radius.uprm.edu'  , 'whitestone');
    if ( (($radius->AccessRequest($uname,$upass))))
        {
            echo ("Success");
        }
    else
        {
            echo ("Failure");
        }