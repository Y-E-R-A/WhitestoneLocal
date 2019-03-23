from flask import jsonify, request
from dao.ParticipatesInDAO import ParticipatesInDAO


class ParticipatesInHandler:


    def buildParticipatesInDict(self, uID, mID):
        result = {}
        result['uID'] = uID
        result['mID'] = mID

        return result

    def mapParticipantsToDict(self, row):
        result = {}
        result['uID'] = row[0]
        result['name'] = row[1]
        result['lastname'] = row[2]
        result['email'] = row[3]
        return result

    def insertCredentialsJSON(self, json):

        uID = json.get('uID')
        mID = json.get('mID')

        if uID and mID:

            ParticipatesInDAO().insert(uID, mID)
            mapped_result = self.buildParticipatesInDict(uID, mID)
            return jsonify(ParticipatesIn = mapped_result), 201

        else:
            return jsonify(Error="Unexpected attributes in post request"), 404

    def getMeetingParticipants(self, mID):

        result = ParticipatesInDAO().getMeetingParticipants(mID)
        mapped_result = []

        if not result:
            return jsonify(Error="NOT FOUND"), 404

        else:
            for r in result:
                mapped_result.append(self.mapParticipantsToDict(r))

            return jsonify(Participant=mapped_result)

