from flask import jsonify, request
from dao.VoteInDAO import VoteInDAO


class VoteInHandler:


    def buildVoteInDict(self, uID, vID):
        result = {}
        result['uID'] = uID
        result['vID'] = vID

        return result

    def insertCredentialsJSON(self, json):

        uID = json.get('uID')
        vID = json.get('vID')

        if uID and vID :

            VoteInDAO().insert(uID, vID)
            mapped_result = self.buildVoteInDict(uID, vID)
            return jsonify(VoteIn = mapped_result), 201

        else:
            return jsonify(Error="Unexpected attributes in post request"), 404