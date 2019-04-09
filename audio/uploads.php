<?php
// echo(phpinfo());
echo("\nFolder upload_tmp_dir is: " . ini_get('upload_tmp_dir'));
// echo("\nFolder sys_get_tmp_dir is: " . sys_get_tmp_dir());
echo("\nHere.\n");
if (isset($_SERVER['REQUEST_METHOD']) && $_SERVER['REQUEST_METHOD'] === 'POST') {
    echo("REQUEST_METHOD === POST\n");
   if (isset($_FILES['file'])) {
        echo("FILES is set.\n");
        $errors = [];
        $path = 'uploads/';
       // $extensions = ['mp3'];
       $file_tmp = $_FILES['file']['tmp_name'];
       $file_name = $_FILES['file']['name'];
       $file = $path . $file_name;
       move_uploaded_file($file_tmp, $file);
       echo("File uploaded: ". $file);
       var_dump($_FILES);
        //$all_files = count($_FILES['files']['tmp_name']);
    //    echo("Number of files: " . $all_files);
        for ($i = 0; $i < $all_files; $i++) {
            echo("Inside if statement.");
            $file_name = $_FILES['file']['name'][$i];
            $file_tmp = $_FILES['file']['tmp_name'][$i];
        //    $file_type = $_FILES['file']['type'][$i];
            $file_size = $_FILES['file']['size'][$i];
            $file_ext = strtolower(end(explode('.', $_FILES['file']['name'][$i])));

            $file = $path . $file_name;
            echo(print_r("File name: " . $file_name));
            echo(print_r("File temporary name: " . $file_tmp));
            echo(print_r("File type: " . $file_type));
            echo(print_r("File size: " . $file_size));
            echo(print_r("Complete file identifier: " . $file));
            // if (!in_array($file_ext, $extensions)) {
            //     $errors[] = 'Extension not allowed: ' . $file_name . ' ' . $file_type;
            // }

            //if ($file_size > 2097152) {
           //     $errors[] = 'File size exceeds limit: ' . $file_name . ' ' . $file_type;
           // }

           // if (empty($errors)) {
                move_uploaded_file($file_tmp, $file);
                echo("File uploaded.");
           // }
        }

        //if ($errors) echo(print_r($errors));



   }
}