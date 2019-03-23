from flask import jsonify, request
from dao.ChooseDAO import ChooseDAO


class ChooseHandler:


    def buildChooseDict(self, uID, altID):
        result = {}
        result['uID'] = uID
        result['altID'] = altID

        return result

    def insertCredentialsJSON(self, json):

        uID = json.get('uID')
        altID = json.get('altID')

        if uID and altID:

            ChooseDAO().insert(uID, altID)
            mapped_result = self.buildChooseDict(uID, altID)
            return jsonify(Choose = mapped_result), 201

        else:
            return jsonify(Error="Unexpected attributes in post request"), 404