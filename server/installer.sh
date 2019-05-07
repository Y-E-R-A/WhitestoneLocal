#!/bin/bash				

##############################################################################################
# Author: Ariel Torres Perez                                                                 #   
# Updated: 5/6/2019                                                                          #
# Purpose: This script is used to install the Whitestone application                         #
#          (server-side), and the whitestone database                                        #
# Instructions: Open the terminal paste the following commands:                              #
#       >> chmod +x <path of this script>                                                    #
#          (Example:chmod +x /home/ariel/Whitestone/installer.sh)                            #
#	>> /home/ariel/Whitestone/installer.sh                                                   #
##############################################################################################

if [ "$(whoami)" != "root" ]			# Request to login as sudo
then
    sudo su -s "$0"
    exit
fi

echo "***WHITESTONE INSTALLATION***"
echo "This script is used to install the Whitestone application (server-side) and the"
echo "Whitestone database. You must execute this script inside a CentOS 7 or RHEL 7 server."
echo " "
echo " "

##############################################################################################
#                                     Whitestone Packages                                    #
##############################################################################################

echo "Whitestone requires the installation of several packages in order to run."
echo "It is recommended that you install all packages to ensure a successful installation."
read -p "Do you wish to install all the necessary packages? Enter 'yes' or 'no':" input	 

while [ $input != "yes" ] && [ $input != "no" ]	# Validate the input yes or no
do
	read -p "Do you wish to install all the necessary packages? Enter yes or no:" input
done

if [[ $input = "yes" ]]	# The user wants to install all packages
then		
	installPackages
	echo "All the necessary packages have been installed."

else 

	echo "No packages will be installed."
fi



installPackages(){
	sudo yum install postgresql-server postgresql-contrib #Install PostgreSQL
	sudo yum install git								  #Install Git
    sudo yum update httpd                                 #Install Apache
    sudo yum install httpd  
    sudo yum install https://centos7.iuscommunity.org/ius-release.rpm  
    sudo yum install python35u
    sudo yum install python35u-pip
    sudo yum install python35u-devel
    sudo pip3.5 install flask
    sudo pip3.5 install flask-cors
    sudo pip3.5 install py-radius

    #Enable services                           
    sudo systemctl enable httpd
    sudo systemctl enable postgresql
}


installWhitestoneApplication(){
	sudo git clone https://whitestone.uprm.edu/Y-E-R-A/Whitestone.git #Downloads the Whitestone application
    sudo cp Whitestone /var/www/html/Whitestone

    #Give ownership permissions to Apache over the audio folder
    sudo chown apache /var/www/html/Whitestone/static/audio
    sudo chgrp apache /var/www/html/Whitestone/static/audio
    sudo chmod 766 /var/www/html/Whitestone/static/audio
}

getApacheConfiguration(){
    $whitestoneApacheFilesPath = "/var/www/html/Whitestone/server"

}

getdatabaseFile(){         # Get the DB backup files path
	read -p "Enter the Whitestone database backup file absolute path:" path
	echo $path				# Return the Whitestone database backup file path
    }

createDatabase(){

	DB_Name="whitestone"			# The database name
	DB_Admin="whitestoneadmin"		# The database administrator
	sudo -u postgres dropdb --if-exists $DB_Name	# Drop the whitetsone db if exist
	sudo -u postgres createdb $DB_Name		# Create a new db named whitestone

    }

#path=$(get_DB_Backup_File)
#while [ ! -f $path ]	 			# Loop until backup path exists
#do	
#	echo "ERROR: File $path not exists" 	# Otherwise the file does not exists
#	get_DB_Backup_File			# Call recursively the function until the input path is correct
#done 


createDatabase 					# Call the function to drop and create a empty db to for the restore
#restoreDB $path					# Restore all the existing data from the .bak file




sudo systemctl start postgresql
sudo systemctl start httpd

exit 0