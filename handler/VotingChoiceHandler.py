from flask import jsonify, request
from dao.VotingChoiceDAO import VotingChoiceDAO


class VotingChoiceHandler:

    def builtVotingChoiceDict(self, altID, vID, choice, votes):
        # Voting Choice Info dictionary
        result = {}
        result['altID'] = altID
        result['vID'] = vID
        result['choice'] = choice
        result['votes']= votes
        return result


    def mapVotingChoiceByVID(self, row):

        result = {}
        result['altID'] = row[0]
        result['choice'] = row[1]
        result['votes']= row[2]
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


    def insertChoiceJSON(self, json):

        vID = json.get('vID')
        choice = json.get('choice');
        votes = json.get('votes')
        if vID and choice and votes:

            altID = VotingChoiceDAO().insert(vID, choice, votes)
            mapped_result = self.builtVotingChoiceDict(altID, vID, choice, votes)
            return jsonify(Choice=mapped_result), 201

        else:

            return jsonify(Error="Unexpected attributes in post request"), 404