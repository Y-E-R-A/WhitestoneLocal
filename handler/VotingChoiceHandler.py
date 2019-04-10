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

    def mapToUpdateVotingChoiceDict(self, vID, altID, votes):
        # Voting Choice Info dictionary
        result = {}
        result['altID'] = altID
        result['vID'] = vID
        result['votes'] = votes
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



    def getActiveVotingChoiceByvID(self, vID):

        result = VotingChoiceDAO().getActiveVotingChoiceByVID(vID)
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
        votes = 0;

        if vID and choice:

            altID = VotingChoiceDAO().insertVotingChoice(vID, choice, votes)
            mapped_result = self.builtVotingChoiceDict(altID, vID, choice, votes)
            return jsonify(Choice=mapped_result), 201

        else:

            return jsonify(Error="Unexpected attributes in post request"), 404



    def updateVotingChoice(self, form):

        altID = form['altID']
        vID = form['vID']
        votes = form['votes']

        if not VotingChoiceDAO().getVotingChoiceByVID(vID):
            return jsonify(Error="Voting Choices not found."), 404
        else:

            if len(form) != 3:
                return jsonify(Error="Malformed update request"), 400
            else:
                if votes and altID and vID:
                    VotingChoiceDAO().updateVotingChoice(votes, altID)
                    result = self.mapToUpdateVotingChoiceDict(vID, altID, votes)
                    return jsonify(Choice=result), 201
                else:
                    return jsonify(Error="Unexpected attributes in update request"), 400