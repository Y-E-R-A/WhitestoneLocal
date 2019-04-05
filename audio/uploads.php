<?php

echo("Here.");
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    echo("REQUEST_METHOD === POST");
    if (isset($_FILES['files'])) {
        echo("FILES is set.");
        $errors = [];
        $path = '/var/www/html/uploads/';
        $extensions = ['mp3'];

        $all_files = count($_FILES['files']['tmp_name']);
        echo("Number of files" . $all_files);
        for ($i = 0; $i < $all_files; $i++) {
            $file_name = $_FILES['files']['name'][$i];
            $file_tmp = $_FILES['files']['tmp_name'][$i];
            $file_type = $_FILES['files']['type'][$i];
            $file_size = $_FILES['files']['size'][$i];
            $file_ext = strtolower(end(explode('.', $_FILES['files']['name'][$i])));

            $file = $path . $file_name;
            echo(print_r("File name: " . $file_name));
            echo(print_r("File temporary name: " . $file_tmp));
            echo(print_r("File type: " . $file_type));
            echo(print_r("File size: " . $file_size));
            echo(print_r("Complete file identifier: " . $file));
            if (!in_array($file_ext, $extensions)) {
                $errors[] = 'Extension not allowed: ' . $file_name . ' ' . $file_type;
            }

            //if ($file_size > 2097152) {
           //     $errors[] = 'File size exceeds limit: ' . $file_name . ' ' . $file_type;
           // }

            if (empty($errors)) {
                move_uploaded_file($file_tmp, $file);
            }
        }

        if ($errors) echo(print_r($errors));



    }
}