<?php

// Check if a POST has been received.
if (isset($_SERVER['REQUEST_METHOD']) && $_SERVER['REQUEST_METHOD'] === 'POST') {
    echo("REQUEST_METHOD === POST\n");

   // Check the $_FILES array for the uploaded file. 
   if (isset($_FILES['file'])) {
       
        $errors = [];
        $path = 'uploads/';
        $extensions = ['mp3'];

        // Get uploaded temporary location.
        $file_tmp = $_FILES['file']['tmp_name'];

        // Get file name.
        $file_name = $_FILES['file']['name'];

        // Create complete file URI by concatenating the path and the file name.
        $file = $path . $file_name;

        // Move the uploaded fille to the correct location.
        move_uploaded_file($file_tmp, $file);
        
        echo("File uploaded: ". $file);
        var_dump($_FILES);

   }
}