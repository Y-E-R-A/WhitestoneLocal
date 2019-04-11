from flask import jsonify, request

from dao.UsersDAO import UsersDAO
from dao.VoteInDAO import VoteInDAO
from dao.VotingQuestionDAO import VotingQuestionDAO


class VoteInHandler:


    def buildVoteInDict(self, vID, uID, exercise_vote):
        result = {}
        result['vID'] = vID
        result['uID'] = uID
        result['exercise_vote'] = exercise_vote
        return result


    def mapVotingParticipantsToDict(self, row):
        result = {}
        result['vID'] = row[0]
        result['uID'] = row[1]
        result['exercise_vote'] = row[2]
        return result


    def getParticipant(self, vID, uID):

        result = VoteInDAO().getParticipant(vID,uID)
        if not result:
            return jsonify(Error="USER IS NOT PARTICIPANT OR VOTING NOT FOUND"), 404
        else:
            mapped_result = self.mapVotingParticipantsToDict(result)
            return jsonify(Participant=mapped_result)



    def insertVoteInJSON(self, json):


        uID = json.get('uID')
        vID = json.get('vID')

        if VoteInDAO().getParticipant(vID, uID):
            return jsonify(Error="User was previously registered for this voting.  Nothing to do"), 400

        elif not VotingQuestionDAO().getVotingQuestionByID(vID) or not(UsersDAO().getUserByuID(uID)):
            return jsonify(Error="NOT FOUND"), 404

        else:
            if uID and vID:

                VoteInDAO().insertVoteIn(uID, vID)
                mapped_result = self.buildVoteInDict(vID, uID, False)
                return jsonify(VoteIn=mapped_result), 201

            else:
                return jsonify(Error="Unexpected attributes in post request"), 404


    def updateVoteInFlag(self, form):

        vID = form['vID']
        uID = form['uID']
        exercise_vote = True


        if not VoteInDAO().getParticipant(vID, uID):
            return jsonify(Error="User is not participant."), 404

        else:

            if len(form) != 2:
                return jsonify(Error="Malformed update request"), 400
            else:
                if vID and uID:
                    VoteInDAO().updateVoteInFlag(uID, vID)
                    result = self.buildVoteInDict(vID, uID, exercise_vote)
                    return jsonify(VoteIN=result), 201
                else:
                    return jsonify(Error="Unexpected attributes in put request"), 400



