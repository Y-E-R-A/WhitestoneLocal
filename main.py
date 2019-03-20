#############################################
# Authors: (CodingGear)                     #
#   Yomaira Rivera Albarran                 #
#   Gustavo Hernandez Ortiz                 #
#   Ariel Torres Perez                      #
#                                           #
# Date: 3/17/2019                           #
# Updated: 3/17/2019                        #
# Distribution: Phyton 2.7                  #
#                                           #
# Whitestone project is a sound and voting  #
# web application designed for the Academic #
# Senate of the UPRM                        #
#############################################



from flask import Flask, request

from handler.CredentialHandler import CredentialHandler
from handler.usersHandler import UsersHandler

app = Flask(__name__)

@app.route('/Whitestone')
def home():

    return "Welcome to Whitestone"


##SEARCH ALL USERS

@app.route('/Whitestone/users', methods = ['GET','POST'])

def getAllUsers():

    if request.method == 'POST':

        print ("REQUEST", request.json)
        return UsersHandler().insertCredentialsJSON(request.json)
    else:

        if request.args:
            return UsersHandler.getAllUsersNames(request.args)

        else:

            handler = UsersHandler()
            return handler.getAllUsersNames()



@app.route('/Whitestone/credentials/<int:cid>')

def getCredentialsById(cid):

    return CredentialHandler().getCredentialById(cid)




if __name__ == '__main__':

    app.run()