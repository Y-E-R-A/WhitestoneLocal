from flask import jsonify, request
from dao.VotingQuestionDAO import VotingQuestionDAO


class VotingQuestionHandler:

    def builtVotingQuestionDict(self, vID, creatorID, mID, vdescription, vdate, vtime, vquestion, selectionlimit, vstatus):
        # Voting Info dictionary
        result = {}
        result['vID'] = vID
        result['creatorID'] = creatorID
        result['mID'] = mID
        result['vdescription'] = vdescription
        result['vdate'] = vdate
        result['vtime'] = vtime
        result['vquestion'] = vquestion
        result['selectionlimit'] = selectionlimit
        result['vtatus'] = vstatus
        return result

    def builtVotingStatusDict(self, vID, vstatus):
        result= {}
        result['vID']= vID
        result['vstatus']= vstatus
        return result

    def mapToVotingQuestionDict(self, row):
        # Voting Question dictionary
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


    def mapToVotingResultsDict(self, row):
        # Voting Result dictionary
        result = {}
        result['vchoice'] = row[0]
        result['votes']= row[1]
        return result


    def getVotingQuestionByID(self, vID):
        result = VotingQuestionDAO().getVotingQuestionByID(vID)

        if not result:
            return jsonify(Error="NOT FOUND"), 404

        else:
            mapped_result= self.mapToVotingQuestionDict(result)
            return jsonify(Voting= mapped_result)

    def getVotingQuestionBymID(self, mID):
        result = VotingQuestionDAO().getVotingQuestionBymID(mID)

        if not result:
            return jsonify(Error="NOT FOUND"), 404

        else:
            mapped_result = self.mapToVotingQuestionDict(result)
            return jsonify(Voting=mapped_result)


    def getVotingResultsByvID(self, vID):
        result = VotingQuestionDAO().getVotingResultsByvID(vID)
        mapped_result = []

        if not result:
            return jsonify(Error="NOT FOUND"), 404

        else:

            for r in result:

                mapped_result.append(self.mapToVotingResultsDict(r))

            return jsonify(VotingResult=mapped_result)


    def updateVotingStatus(self, vID, form):

        if not VotingQuestionHandler().getVotingQuestionByID(vID):
            return jsonify(Error="Voting not found."), 404
        else:
            if len(form) != 2:
                return jsonify(Error="Malformed update request"), 400
            else:

                vID= form['vID']
                vstatus= form['vstatus']

                if vID and vstatus:
                    VotingQuestionDAO().updateVotingStatus(vID, vstatus)
                    result = self.builtVotingStatusDict(vID, vstatus)
                    return jsonify(Voting=result), 201
                else:
                    return jsonify(Error="Unexpected attributes in update request"), 400


    def insertCredentialsJSON(self, json):

        creatorID = json.get('creatorID')
        mID = json.get('mID')
        vdescription = json.get('vdescription')
        vdate = json.get('vdate')
        vtime = json.get('vtime')
        vquestion = json.get('vquestion')
        selectionlimit = json.get('selectionlimit')
        vstatus = json.get('vstatus')


        if creatorID and mID and vdate and vtime and vquestion and selectionlimit and vstatus:

            vID = VotingQuestionDAO().insert(creatorID, mID, vdescription, vdate, vtime, vquestion, selectionlimit, vstatus)
            mapped_result = self.builtVotingQuestionDict(vID, creatorID, mID, vdescription, vdate, vtime, vquestion, selectionlimit, vstatus)
            return jsonify(Voting=mapped_result), 201

        else:

            return jsonify(Error="Unexpected attributes in post request"), 404