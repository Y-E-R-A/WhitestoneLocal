from flask import jsonify, request
from dao.ParticipatesInDAO import ParticipatesInDAO


class ParticipatesInHandler:


    def buildParticipatesInDict(self, uID, mID):
        result = {}
        result['uID'] = uID
        result['mID'] = mID

        return result

    def insertCredentialsJSON(self, json):

        uID = json.get('uID')
        mID = json.get('mID')

        if uID and mID :

            ParticipatesInDAO().insert(uID, mID)
            mapped_result = self.buildParticipatesInDict(uID, mID)
            return jsonify(ParticipatesIn = mapped_result), 201

        else:
            return jsonify(Error="Unexpected attributes in post request"), 404