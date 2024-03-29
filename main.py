#!/usr/bin/python3.5
print("Content-type:text/html\r\n\r\n")

#############################################
# Authors: (CodingGear)                     #
#   Yomaira Rivera Albarran                 #
#   Gustavo Hernandez Ortiz                 #
#   Ariel Torres Perez                      #
#                                           #
# Date: 3/17/2019                           #
# Updated: 3/26/2019                        #
# Distribution: Phyton 3.5                  #
#                                           #
# Whitestone project is a sound and voting  #
# web application designed for the Academic #
# Senate of the UPRM                        #
#############################################


from flask_cors import CORS, cross_origin
from flask import Flask, request, render_template, make_response
from handler.ActivityLogHandler import ActivityLogHandler
from handler.AudioHandler import AudioHandler
from handler.CredentialHandler import CredentialHandler
from handler.MeetingHandler import MeetingHandler
from handler.UsersHandler import UsersHandler
from handler.VoteInHandler import VoteInHandler
from handler.VotingChoiceHandler import VotingChoiceHandler
from handler.VotingQuestionHandler import VotingQuestionHandler
from handler.RequestsHandler import RequestsHandler
from werkzeug.utils import secure_filename##
import os##

app = Flask(__name__ )

CORS(app)
@app.route("/")
def root():
    return "Hello"

#@app.route("/white")
#def getHtml():
#    headers = {'Content-Type': 'text/html'}
#    return make_response(render_template('index.html'),200,headers)

# Search list for emergency local access
@app.route('/whitestone/credentials', methods=['GET', 'POST', 'PUT'])
def getAllCredentials():

    if request.method == 'POST':

        print("REQUEST", request.json)
        return CredentialHandler().insertCredentialJSON(request.json)

    if request.method == 'PUT':
        print("REQUEST", request.json)
        return CredentialHandler().updateCredential(request.json)

    else:
        return CredentialHandler().getAllCredentials()



# Search all the user information using its email as identifier
@app.route('/whitestone/credentials/user', methods=['POST'])
def getUser():

    print("Request", request.json)
    return UsersHandler().getUserByEmail(request.json)


# Search all the user information using its email as identifier
@app.route('/whitestone/delete/user/<int:uID>', methods=['POST'])
def deleteUser(uID):

    return UsersHandler().deleteUser(uID)


# Search all the info from users registered
@app.route('/whitestone/users', methods=['GET', 'POST'])
def getAllUsers():

    if request.method == 'POST':

        print("REQUEST", request.json)
        return UsersHandler().insertUserJSON(request.json)
    else:

        return UsersHandler().getAllUsersInfo()


# Edit user information
@app.route('/whitestone/edituser/<int:uid>', methods=["PUT"])
def updateUser(uid):
    print("REQUEST", request.json)
    return UsersHandler().updateUser(uid, request.json)


# Search all senators including the chancellor
@app.route('/whitestone/senators', methods=['GET'])
def getAllSenators():
    return UsersHandler().getAllSenator()



# Search all elect senators
@app.route('/whitestone/electsenators', methods=['GET'])
def getAllElectSenators():
    return UsersHandler().getAllElectSenator()


# Search all elect student senators
@app.route('/whitestone/electstudentsenators', methods=['GET'])
def getAllElectStudentSenators():
    return UsersHandler().getAllElectStudentsSenator()


# Search all ex-officio senators
@app.route('/whitestone/exofficiosenators', methods=['GET'])
def getAllExOfficioSenators():
    return UsersHandler().getAllExOfficioSenator()


# Search all Ex-Officio student senators
@app.route('/whitestone/exofficiostudentsenators', methods=['GET'])
def getAllExOfficioStudentSenators():
    return UsersHandler().getAllExOfficioStudentsSenator()


# Search old meetings (inactive)
@app.route('/whitestone/meeting/oldmeetings', methods=['GET'])
def getOldMeetings():
    return MeetingHandler().getOldMeetings()


# Show the active meeting and its info
@app.route('/whitestone/activemeeting', methods=['GET', 'POST'])
def getMeeting():

    if request.method == 'POST':

        print("REQUEST", request.json)
        return MeetingHandler().insertMeetingJSON(request.json)

    else:
        return MeetingHandler().getActiveMeeting()



# Update meeting status
@app.route('/whitestone/meetingstatus', methods=["PUT"])
def updateMeetingStatus():
    print("REQUEST", request.json)
    return MeetingHandler().updateMeetingStatus(request.json)


# Post voting question by mID
@app.route('/whitestone/voting',  methods=['POST'])
def postVotingBymID():
    print("REQUEST", request.json)
    return VotingQuestionHandler().insertVotingJSON(request.json)


# Get inactive or closed voting question by mID
@app.route('/whitestone/inactivevotings/<int:mID>')
def getInactiveVotingBymID(mID):
    return VotingQuestionHandler().getInactiveVotingQuestionBymID(mID)


# Get active or open voting question by mID
@app.route('/whitestone/activevotings/<int:mID>', methods=['GET'])
def getActiveVotingBymID(mID):
    return VotingQuestionHandler().getActiveVotingQuestionBymID(mID)


# Search voting by vID
@app.route('/whitestone/voting/<int:vid>')
def getVotingByvID(vid):
    return VotingQuestionHandler().getVotingQuestionByID(vid)


# Put the voting results by vID
@app.route('/whitestone/votingresults', methods=['PUT'])
def updateVotingResults():
    print("REQUEST", request.json)
    return VotingChoiceHandler().updateVotingChoice(request.json)


# Post voting alternatives
@app.route('/whitestone/voting/choice', methods=['POST'])
def postAlternatives():
    print("REQUEST", request.json)
    return VotingChoiceHandler().insertChoiceJSON(request.json)


# Search voting choices and its altIDs by voting id
@app.route('/whitestone/voting/<int:vid>/choices')
def getAlternatives(vid):
    return VotingChoiceHandler().getVotingChoiceByVID(vid)


# Search active voting choices and its altIDs by voting id
@app.route('/whitestone/activevoting/<int:vid>/choices')
def getActiveVotingAlternatives(vid):
    return VotingChoiceHandler().getActiveVotingChoiceByvID(vid)

############### NEW ###################################
# Submit the users choice and updates the selected choice in the list of choices
@app.route('/whitestone/voting/choicesnew', methods=['POST'])
def updateChoice():
    print("REQUEST", request.json)
    return VotingChoiceHandler().updateChoiceArray(request.json)

# Gets the choices from the active voting question with its results
@app.route('/whitestone/voting/choicesResult', methods=['GET'])
def getChoiceResults():
    print("REQUEST", request.json)
    return VotingChoiceHandler().getChoiceResult()
######################################################

# Update voting status to Inactive
@app.route('/whitestone/closevoting', methods=['PUT'])
def closeVoting():
    print("REQUEST", request.json)
    return VotingQuestionHandler().updateVotingStatus(request.json)


# Post or get audio by mID
@app.route('/whitestone/meeting/<int:mid>/audio', methods=['POST', 'GET'])
def meetingAudio(mid):
    if request.method == 'POST':
        print("REQUEST", request.json)
        return AudioHandler().insertAudioJSON(request.json)
    else:
     return AudioHandler().getAudioBymID(mid)



# Get audio by aid
@app.route('/whitestone/audio/<int:aid>', methods=['GET'])
def getAudio(aid):

     return AudioHandler().getAudioByaID(aid)




# Post or get voting participant
@app.route('/whitestone/<int:uid>/votesIn/<int:vid>', methods=['POST', 'GET', 'PUT'])
def VotesIn(vid, uid):
    if request.method == 'POST':
        print("REQUEST", request.json)
        return VoteInHandler().insertVoteInJSON(request.json)

    if request.method == 'PUT':
        print("REQUEST", request.json)
        return VoteInHandler().updateVoteInFlag(request.json)

    else:
        return VoteInHandler().getParticipant(vid, uid)


# Get last inactive or closed voting question by mID
@app.route('/whitestone/lastvoting/<int:mID>')
def getLastInactiveVotingBymID(mID):
    return VotingQuestionHandler().getLastInactiveVotingQuestionBymID(mID)

# Post new activity log
@app.route('/whitestone/activitylog', methods=['POST'])
def ActivityLog():
    print("REQUEST", request.json)
    return ActivityLogHandler().insertActivityLogJSON(request.json)

# Get activity log by date
@app.route('/whitestone/radius', methods=['POST'])
def getRADIUS():
    print("REQUEST", request.json)
    return ActivityLogHandler().getActivityLogByDate(request.json.get('date'))

#####################NEW TURN METHODS###################
# Update the waiting list
@app.route('/whitestone/requestTurn', methods=['POST'])
def postRequest():
    print("REQUEST", request.json)
    return RequestsHandler().submitRequest(request.json)

# Update the waiting list
@app.route('/whitestone/cancelTurn', methods=['POST'])
def cancelRequest():
    print("REQUEST", request.json)
    return RequestsHandler().cancelRequest(request.json)

# Update the waiting list
@app.route('/whitestone/checkrequest/<int:uid>', methods=['GET'])
def checkRequest(uid):
    print("checkRequest")
    return RequestsHandler().checkRequest(uid)

# Update the waiting list
@app.route('/whitestone/checkapproval', methods=['POST'])
def checkApproval():
    print("REQUEST", request.json)
    return RequestsHandler().checkApproval(request.json)

# Update the waiting list
@app.route('/whitestone/emptylist', methods=['POST'])
def clearList():
    print("REQUEST", request.json)
    return RequestsHandler().clearList(request.json)

# Update the waiting list
@app.route('/whitestone/grantrequest', methods=['PUT'])
def grantRequestToSenator():
    print("REQUEST", request.json)
    return RequestsHandler().grantRequest(request.json)

# Update the waiting list
@app.route('/whitestone/denyrequest', methods=['PUT'])
def denyRequestToSenator():
    print("REQUEST", request.json)
    return RequestsHandler().denyRequest(request.json)

# Update the waiting list
@app.route('/whitestone/getrequestlist', methods=['GET'])
def getRequestList():
    print("REQUEST", request.json)
    return RequestsHandler().getRequestList()
########################################################
#####################TURN METHODS########################
# Update the waiting list
#@app.route('/whitestone/requestTurn', methods=['POST'])
#def postRequest():
#    print("REQUEST", request.json)
#    return AudioHandler().submitRequest(request.json)

# Update the waiting list
#@app.route('/whitestone/cancelTurn', methods=['POST'])
#def cancelRequest():
#    print("REQUEST", request.json)
#    return AudioHandler().cancelRequest(request.json)


# Update the waiting list
#@app.route('/whitestone/checkrequest/<int:uid>', methods=['GET'])
#def checkRequest(uid):
#    print("checkRequest")
#    return AudioHandler().checkRequest(uid)

# Update the waiting list
#@app.route('/whitestone/checkapproval', methods=['POST'])
#def checkApproval():
#    print("REQUEST", request.json)
#    return AudioHandler().checkApproval(request.json)

# Update the waiting list
#@app.route('/whitestone/emptylist', methods=['POST'])
#def clearList():
#    print("REQUEST", request.json)
#    return AudioHandler().clearList(request.json)

# Update the waiting list
#@app.route('/whitestone/grantrequest', methods=['PUT'])
#def grantRequestToSenator():
#    print("REQUEST", request.json)
#    return AudioHandler().grantRequest(request.json)

# Update the waiting list
#@app.route('/whitestone/denyrequest', methods=['PUT'])
#def denyRequestToSenator():
#    print("REQUEST", request.json)
#    return AudioHandler().denyRequest(request.json)

# Update the waiting list
#@app.route('/whitestone/getrequestlist', methods=['GET'])
#def getRequestList():
#    print("REQUEST", request.json)
#    return AudioHandler().getRequestList()
#########################################################

# Get activity log by date
@app.route('/whitestone/getactivitylog', methods=['POST'])
def getActivityLog():
    print("REQUEST", request.json)
    return ActivityLogHandler().getActivityLogByDate(request.json.get('date'))

# Upload audio file folder
@app.route('/audio', methods=['POST'])
def uploadFile():
    if request.method == 'POST':
        print("REQUEST",request)
        file = request.files['file']
        #file.save(os.path.join('/var/www/html/Whitestone/audio', secure_filename(file.filename)))
        file.save(os.path.join('/home/gustavo/PycharmProjects/whitestone_new/Whitestone_app/audio' ,secure_filename(file.filename)))
        return "Uploaded file: " + file.filename

if __name__ == '__main__':

    app.run()