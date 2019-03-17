from flask import jsonify, request
from dao.VotingQuestionDAO import VotingQuestionDAO


class VotingQuestionsHandler:

    def builtVotingQuestionDict(self, row):
        # Voting Info dictionary
        result = {}
        result['vID'] = row[0]
        result['creatorID'] = row[1]
        result['mID'] = row[2]
        result['vdescription'] = row[3]
        result['vdate'] = row[4]
        result['vtime'] = row[5]
        result['vquestion'] = row[6]
        result['selectionlimit'] = row[7]
        result['vtatus'] = row[8]
        return result

    def mapToVotingQuestionDict(self, row):
        # Voting Question dictionary
        result = {}
        result['vquestion'] = row[0]
        return result


    def mapToVotingResultsDict(self, row):
        # Voting Result dictionary
        result = {}
        result['vchoice'] = row[0]
        result['votes']= row[1]
        return result






    def getVotingQuestionByID(self, vID):
        result = VotingQuestionDAO.getVotingQuestionByID(vID)
        mapped_result = []

        if not result:
            return jsonify(Error="NOT FOUND"), 404

        else:
            mapped_result.append(self.mapToVotingQuestionDict(0))
            return jsonify(Voting=mapped_result)


    def getVotingResultsByvID(self, vID):
        result = VotingQuestionDAO.getVotingResultsByvID(vID)
        mapped_result = []

        if not result:
            return jsonify(Error="NOT FOUND"), 404

        else:

            for r in result:

                mapped_result.append(self.mapToVotingResultsDict(r))

            return jsonify(VotingResult=mapped_result)


