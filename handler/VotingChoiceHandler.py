from flask import jsonify, request
from dao.VotingChoiceDAO import VotingChoiceDAO


class VotingChoiceHandler:

    def builtVotingChoiceDict(self, altID, vID, choice):
        # Voting Choice Info dictionary
        result = {}
        result['altID'] = altID
        result['vID'] = vID
        result['choice'] = choice
        return result


    def mapVotingChoiceByVID(self, row):

        result = {}
        result['altID'] = row[0]
        result['choice'] = row[1]
        return result


    def getVotingChoiceByVID(self, vID):

        result = VotingChoiceDAO().getVotingChoiceByVID(vID)
        mapped_result = []

        if not result:
            return jsonify(Error="NOT FOUND"), 404

        else:
            for r in result:
                mapped_result.append(self.mapVotingChoiceByVID(r))

            return jsonify(Choice=mapped_result)


    def insertCredentialsJSON(self, json):

        vID = json.get('vID')
        choice = json.get('choice');

        if vID and choice:

            altID = VotingChoiceDAO().insert(vID, choice)
            mapped_result = self.builtVotingChoiceDict(altID, vID, choice)
            return jsonify(Choice=mapped_result), 201

        else:

            return jsonify(Error="Unexpected attributes in post request"), 404