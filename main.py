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

# Apply CORS to this app

CORS(app)

@app.route('/')

def home():

    return "Welcome to Whitestone"


