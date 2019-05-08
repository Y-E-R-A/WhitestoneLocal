##############################################################################################
# Team: CodingGear                                                                           #              #
# Authors: Ariel Torres Perez, Yomaira Rivera Albarran, Gustavo Hernandez Ortiz              #                                                              #   
# Updated: 5/8/2019                                                                          #
# Purpose: The purpose of this file is to detail the installtion process                     #
#          for the Whitestone application                                                    #
##############################################################################################

Whitestone is an audio and voting web application designed for use in the Academic Senate of
the University of Puerto Rico - Mayaguez Campus. The purpose of this file is to provide key 
guidance to the individuals within the organzation who are responsible for the installation 
and maintenance of the Whitestone application.

Prerequisites

What is needed in order to install Whitestone?
-An Apache web server running on a CentOS 7 or RHEL 7 distribution
-The PostgreSQL database service
-Python 3.5 or higher, Pip, and Flask
-The Whitestone application folders and its corresponding database

Installation Options

There are multiple options in order to install the Whitestone application. The path that you
must follow will depend on your current needs.

A. I need to install the Whitestone application from scratch

1. Create a CentOS 7 or RHEL 7 server instance. Install Apache and the corresponding SSL modules 
in order to enable TLS. The explanation for this step is beyond the scope of this guide. Please 
note that at the end of your ssl.conf file you must add the following:

        LoadModule cgi_module modules/mod_cgi.so
        LoadModule proxy_uwsgi_module modules/mod_proxy_uwsgi.so

        WSGIDaemonProcess main threads=5
        WSGIScriptAlias / /var/www/html/Whitestone/Whitestone.wsgi
        WSGIScriptReloading On
        <Directory Whitestone>
                WSGIProcessGroup main
                WSGIApplicationGroup %{GLOBAL}
                Order allow,deny
                Deny from all
                Allow from 136.145.56.166
                Allow from 127
        </Directory>

</VirtualHost>

2. Install the PostgreSQL database service using the following commands:
sudo yum install postgresql-server postgresql-contrib
3. Install Python 3.5 and all the necessary packages that support the execution of the 
application. Run the following commands:
    sudo yum install yum-utils
    sudo yum install https://centos7.iuscommunity.org/ius-release.rpm
    sudo yum install python35u
    sudo yum install python35u-pip
    sudo yum install python35u-devel
    sudo pip3.5 install flask
    sudo pip3.5 install flask-cors
    sudo pip3.5 install py-radius
    sudo yum install git
4. Put the Whitestone application folders in the location in which they will be served by 
Apache. It is recommended that you use the included restore.sh script with the default 
installation as argument. This script will also create the Whitestone database along with 
the required credentials and configurations. Please not that, even though the on-screen 
instructions suggest that the script is used to restore the application from a previously 
created backup, the default installation file should work as well.

If for any reason you decide to install the application manualy, it is possible to do so. 
After using tar to decompress the file, use the cp command. In order to avoid issues, we 
recommend that you use the default folder for this purpose, which is /var/www/html. 
Assuming that the folders have been uncompressed at /home/users, use the following:
cp -avr /home/users/Whitestone /var/www/html. You must then create a database called 
"whitestone" using "whitestoneadmin" as user. For guidance on this section, we recommend that 
you follow the default .sql file included and the configuration found inside your 
Whitestone/configs/dbconfig.py file.

5. 


