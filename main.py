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


@app.route('/whitestone/login')
def home():

    return "Welcome to Whitestone"



# From the admin dashboard search for the user credentials (email, pin)
# List for emergency local access
@app.route('/whitestone/credentials', methods = ['GET','POST'])
def getAllCredentials():

    if request.method == 'POST':

        print ("REQUEST", request.json)
        return CredentialHandler().insertCredentialJSON(request.json)
    else:
        handler = CredentialHandler()
        return handler.getAllCredentials()


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
@app.route('/whitestone/edituser/<int:uid>')
def updateUser(uid):
    print("REQUEST", request.json)
    return UsersHandler().updateUser(uid, request.json)


# Search all senators including the chancellor
@app.route('/whitestone/senators', methods = ['GET'])
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
@app.route('/whitestone/meeting/oldmeetings', methods = ['GET'])
def getOldMeetings():
    return MeetingHandler().getOldMeetings()


# Show the active meeting and its info
@app.route('/whitestone/meeting', methods = ['GET','POST'])
def getMeeting():

    if request.method == 'POST':

        print ("REQUEST", request.json)
        return MeetingHandler().insertCredentialsJSON(request.json)

    else:

        handler = MeetingHandler()
        return handler.getActiveMeeting()


# Search voting by mID
@app.route('/whitestone/votings/<int:mID>',  methods = ['POST', 'GET'])
def getVotingBymID(mID):
    if request.method == 'POST':

        print("REQUEST", request.json)
        return VotingQuestionHandler().insertCredentialsJSON(request.json)
    else:
        return VotingQuestionHandler().getVotingQuestionBymID(mID)


# Search voting by vID
@app.route('/whitestone/voting/<int:vid>')
def getVotingByvID(vid):
    return VotingQuestionHandler().getVotingQuestionByID(vid)


# Search voting results by vID
@app.route('/whitestone/voting/<int:vid>/results')
def getVotingResultByvID(vid):
    return VotingQuestionHandler().getVotingResultsByvID(vid)


# Post voting alternatives
@app.route('/whitestone/voting/choice', methods = ['POST'])
def postAlternatives():
    print ("REQUEST", request.json)
    return VotingChoiceHandler().insertCredentialsJSON(request.json)


# Search voting choices and its altIDs by voting id
@app.route('/whitestone/voting/<int:vid>/choices')
def getAlternatives(vid):
    return VotingChoiceHandler().getVotingChoiceByVID(vid)


# Update voting status
@app.route('/whitestone/voting/<int:vid>')
def updateVotingStatus(vid):
    print("REQUEST", request.json)
    return VotingQuestionHandler().updateVotingStatus(vid, request.json)

# Post audio
@app.route('/whitestone/meeting/audio', methods = ['POST'])
def postAudio():
    print ("REQUEST", request.json)
    return AudioHandler().insertCredentialsJSON(request.json)


# Search audio by meeting id
@app.route('/whitestone/meeting/<int:mid>/audio')
def getAudioBymID(mid):
    return AudioHandler().getAudioBymID(mid)

# Post meeting participant
@app.route('/whitestone/participatesIn/meeting/<int:mid>', methods = ['POST', 'GET'])
def ParticipatesIn(mid):
    if request.method == 'POST':

        print("REQUEST", request.json)
        return ParticipatesInHandler().insertCredentialsJSON(request.json)

    else:

        return ParticipatesInHandler().getMeetingParticipants(mid)

# Update meeting status
@app.route('/whitestone/meetingstatus')
def updateMeetingStatus():
    print("REQUEST", request.json)
    return MeetingHandler().updateMeetingStatus(request.json)


# Post voting participant
@app.route('/whitestone/votesin/<int:vid>', methods = ['POST', 'GET'])
def VotesIn(vid):
    if request.method == 'POST':

        print("REQUEST", request.json)
        return VoteInHandler().insertCredentialsJSON(request.json)

    else:
        return VoteInHandler().getVotingParticipants(vid)


# Post user vote in table Choose
@app.route('/whitestone/<int:uid>/choose/<int:altid>', methods = ['POST'])
def PostChoose():
    print("REQUEST", request.json)
    return ChooseHandler().insertCredentialsJSON(request.json)



# Activity Log
@app.route('/whitestone/activitylog/<string:date>', methods = ['POST', 'GET'])
def ActivityLog(date):
    if request.method == 'POST':

        print("REQUEST", request.json)
        return ActivityLogHandler().insertCredentialsJSON(request.json)

    else:
        return ActivityLogHandler().getActivityLogByDate(date)



if __name__ == '__main__':

    app.run()