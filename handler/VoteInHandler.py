from flask import jsonify, request
from dao.VoteInDAO import VoteInDAO


class VoteInHandler:


    def buildVoteInDict(self, uID, vID):
        result = {}
        result['uID'] = uID
        result['vID'] = vID

        return result
    def mapVotingParticipantsToDict(self, row):
        result = {}
        result['uID'] = row[0]
        result['name'] = row[1]
        result['lastname'] = row[2]
        result['email'] = row[3]
        return result


    def getVotingParticipants(self, vID):
        result = VoteInDAO().getVotingParticipants(vID)
        mapped_result = []

        if not result:
            return jsonify(Error="NOT FOUND"), 404

        else:
            for r in result:
                mapped_result.append(self.mapVotingParticipantsToDict(r))

            return jsonify(Participant=mapped_result)

    def isParticipant(self, vID, uID):

        result = VoteInDAO().isParticipant(vID,uID)
        if not result:
            return jsonify(Error="USER IS NOT PARTICIPANT"), 404
        else:
            return jsonify(Participant="USER IS PARTICIPANT")



    def insertCredentialsJSON(self, json):

        uID = json.get('uID')
        vID = json.get('vID')

        if uID and vID :

            VoteInDAO().insert(uID, vID)
            mapped_result = self.buildVoteInDict(uID, vID)
            return jsonify(VoteIn = mapped_result), 201

        else:
            return jsonify(Error="Unexpected attributes in post request"), 404