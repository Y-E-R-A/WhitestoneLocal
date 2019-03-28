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
from flask import Flask, request
from handler.ActivityLogHandler import ActivityLogHandler
from handler.AudioHandler import AudioHandler
from handler.ChooseHandler import ChooseHandler
from handler.CredentialHandler import CredentialHandler
from handler.MeetingHandler import MeetingHandler
from handler.ParticipatesInHandler import ParticipatesInHandler
from handler.UsersHandler import UsersHandler
from handler.VoteInHandler import VoteInHandler
from handler.VotingChoiceHandler import VotingChoiceHandler
from handler.VotingQuestionHandler import VotingQuestionHandler

app = Flask(__name__)

CORS(app)
# @app.route('/whitestone/login')
# def home():
#
#     return "Welcome to Whitestone"



# From the admin dashboard search for the user credentials (email, pin)
# List for emergency local access
@app.route('/whitestone/credentials', methods = ['GET','POST'])
def getAllCredentials():

    if request.method == 'POST':

        print("REQUEST", request.json)
        return CredentialHandler().insertCredentialJSON(request.json)
    else:
        handler = CredentialHandler()
        return handler.getAllCredentials()



# Search all the user information using its email as identifier
@app.route('/whitestone/credentials/user', methods = ['POST'])
def getUser():

    print("Request",request.json)
    handler = UsersHandler()
    return handler.getUserByEmail(request.json.get('email'))


# Search all the info from users registered
@app.route('/whitestone/users', methods = ['GET','POST'])
def getAllUsers():

    if request.method == 'POST':

        print ("REQUEST", request.json)
        return UsersHandler().insertCredentialsJSON(request.json)
    else:

        handler = UsersHandler()
        return handler.getAllUsersInfo()


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
@app.route('/whitestone/electsenators', methods = ['GET'])
def getAllElectSenators():
    return UsersHandler().getAllElectSenator()


# Search all elect student senators
@app.route('/whitestone/electstudentsenators', methods = ['GET'])
def getAllElectStudentSenators():
    return UsersHandler().getAllElectStudentsSenator()


# Search all ex-officio senators
@app.route('/whitestone/exofficiosenators', methods = ['GET'])
def getAllExOfficioSenators():
    return UsersHandler().getAllExOfficioSenator()


# Search all Ex-Officio student senators
@app.route('/whitestone/exofficiostudentsenators', methods = ['GET'])
def getAllExOfficioStudentSenators():
    return UsersHandler().getAllExOfficioStudentsSenator()


# Search old meetings (inactive)
@app.route('/whitestone/meeting/oldmeetings', methods=['GET'])
def getOldMeetings():
    return MeetingHandler().getOldMeetings()


# Show the active meeting and its info
@app.route('/whitestone/activemeeting', methods=['GET','POST'])
def getMeeting():

    if request.method == 'POST':

        print ("REQUEST", request.json)
        return MeetingHandler().insertCredentialsJSON(request.json)

    else:

        handler = MeetingHandler()
        return handler.getActiveMeeting()


# Post voting question by mID
@app.route('/whitestone/voting',  methods = ['POST'])
def postVotingBymID():
    print("REQUEST", request.json)
    return VotingQuestionHandler().insertCredentialsJSON(request.json)


# Get inactive or closed voting question by mID
@app.route('/whitestone/inactivevotings/<int:mID>', methods=['GET'])
def getInactiveVotingBymID(mID):
    VotingQuestionHandler().getInactiveVotingQuestionBymID(mID)


# Get inactive or closed voting question by mID
@app.route('/whitestone/activevotings/<int:mID>', methods=['GET'])
def getActiveVotingBymID(mID):
    VotingQuestionHandler().getActiveVotingQuestionBymID(mID)


# Search voting by vID
@app.route('/whitestone/voting/<int:vid>')
def getVotingByvID(vid):
    return VotingQuestionHandler().getVotingQuestionByID(vid)


# Search voting results by vID
@app.route('/whitestone/voting/<int:vid>/results')
def getVotingResultByvID(vid):
    return VotingQuestionHandler().getVotingResultsByvID(vid)


# Post voting alternatives
@app.route('/whitestone/voting/choice', methods=['POST'])
def postAlternatives():
    print ("REQUEST", request.json)
    return VotingChoiceHandler().insertCredentialsJSON(request.json)


# Search voting choices and its altIDs by voting id
@app.route('/whitestone/voting/<int:vid>/choices')
def getAlternatives(vid):
    return VotingChoiceHandler().getVotingChoiceByVID(vid)


# Update voting status
@app.route('/whitestone/votingstatus/<int:vid>', methods=['PUT'])
def updateVotingStatus(vid):
    print("REQUEST", request.json)
    return VotingQuestionHandler().updateVotingStatus(vid, request.json)

# Post or get audio by mID
@app.route('/whitestone/meeting/<int:mid>/audio', methods = ['POST'])
def meetingAudio(mid):
    if request.method == 'POST':
        print("REQUEST", request.json)
        return AudioHandler().insertJSON(request.json)
    else:
     return AudioHandler().getAudioBymID(mid)



# Get audio by aid
@app.route('/whitestone/audio/<int:aid>', methods = ['GET'])
def getAudio(aid):

     return AudioHandler().getAudioByaID(aid)



# Post meeting participant
@app.route('/whitestone/participatesIn/meeting/<int:mid>', methods = ['POST', 'GET'])
def ParticipatesIn(mid):
    if request.method == 'POST':

        print("REQUEST", request.json)
        return ParticipatesInHandler().insertCredentialsJSON(request.json)

    else:

        return ParticipatesInHandler().getMeetingParticipants(mid)

# Update meeting status
@app.route('/whitestone/meetingstatus', methods= ["PUT"])
def updateMeetingStatus():
    print("REQUEST", request.json)
    return MeetingHandler().updateMeetingStatus(request.json)


# Post or get voting participant
@app.route('/whitestone/votesIn/<int:vid>', methods=['POST', 'GET'])
def VotesIn(vid):
    if request.method == 'POST':

        print("REQUEST", request.json)
        return VoteInHandler().insertCredentialsJSON(request.json)

    else:
        return VoteInHandler().getVotingParticipants(vid)


# Post user vote in table Choose
@app.route('/whitestone/votesubmission', methods=['POST'])
def postChoose():
    print("REQUEST", request.json)
    return ChooseHandler().insertCredentialsJSON(request.json)


# Activity Log

@app.route('/whitestone/activitylog', methods = ['POST', 'GET'])
def ActivityLog():
    if request.method == 'POST':

        print("REQUEST", request.json)
        return ActivityLogHandler().insertCredentialsJSON(request.json)

    else:
        return ActivityLogHandler().getActivityLogByDate(request.json.get('date'))



if __name__ == '__main__':

    app.run()