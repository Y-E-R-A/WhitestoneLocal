#!/bin/bash				

##############################################################################################
# Author: Ariel Torres Perez                                                                 #   
# Updated: 5/7/2019                                                                          #
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
	sudo yum install postgresql-server postgresql-contrib
	sudo yum install git								  
    sudo yum update httpd                                 
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

##############################################################################################
#                                     Whitestone Installation                                #
##############################################################################################

get_Backup_File(){
						# Get the backup files path
	read -p "Enter the Whitestone distribution file absolute path:" path
	echo $path				# Resturn the Whitestone Project backup path value
}

untar_Backup_File(){

	echo "Distribution file path: $1"		# Backup file was found
	tar -xvf $1 -C /var/www/html/           # Extract the contents of path to the directory specified 
	if  [ $? = "0" ]; then 
		echo "Extract Complete"		# If "0" restore was a sucess
	else
		echo "Extract Error" 		# Otherwise an error occurred
	fi
}

get_DB_Backup_File(){
						# Get the DB backup files path
	read -p "Enter the Whitestone database file absolute path:" path
	echo $path				# Return the Whitestone database backup file path
}

restoreDB(){

	DB_Name="whitestone"			# The database name
	DB_Admin="whitestoneadmin"		# The database administrator


						# Preparing folder for the backup
	if  [ -f /var/lib/postgresql/Backups ]; then 
		mkdir /var/lib/postgresql/Backups 
	fi

	psql $DB_Name -U $DB_Admin -W< $1	# Perform the backup process

	if  [ $? = "1" ]; then 
		echo "Creation error."		# If "1" an error occurred
	else
		echo "Creation completed." 	# If "0" restores was a success
	fi

}

createDB(){

	DB_Name="whitestone"			# The database name
	DB_Admin="whitestoneadmin"		# The database administrator
	sudo -u postgres dropdb --if-exists $DB_Name	# Drop the whitetsone db if exist
	sudo -u postgres createdb $DB_Name		# Create a new db named whitestone

}

configureWhitestoneApplication(){

    #Give ownership permissions to Apache over the audio folder
    sudo chown apache /var/www/html/Whitestone/static/audio
    sudo chgrp apache /var/www/html/Whitestone/static/audio
    sudo chmod 766 /var/www/html/Whitestone/static/audio
    
    #Configure Apache using the predefined files
    sudo cp /var/www/html/Whitestone/server/httpd.conf /etc/httpd/conf/httpd.conf
    sudo cp /var/www/html/Whitedtone/server/ssl.conf /etc/httpd/conf.d/ssl.conf
}


path=$(get_Backup_File)
while [ ! -f $path ]	 			# Loop until backup path exists
do	
	echo "ERROR: File $path not exists" 	# Otherwise the file does not exists
	get_Backup_File				# Call recursively the function until the input path is correct
done 

untar_Backup_File $path				# Call function to extract the tar backup file

path=$(get_DB_Backup_File)
while [ ! -f $path ]	 			# Loop until backup path exists
do	
	echo "ERROR: File $path not exists" 	# Otherwise the file does not exists
	get_DB_Backup_File			# Call recursively the function until the input path is correct
done 


createDB 					# Call the function to drop and create a empty db to for the restore
restoreDB $path					# Restore all the existing data from the .bak file
configureWhitestoneApplication
sudo systemctl start postgresql
sudo systemctl start httpd
sudo systemct daemon-reload
exit 0