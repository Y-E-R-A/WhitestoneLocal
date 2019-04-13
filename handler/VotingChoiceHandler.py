from flask import jsonify, request
from dao.VotingChoiceDAO import VotingChoiceDAO
from dao.VotingQuestionDAO import VotingQuestionDAO

###NEW##
choiceResultArray = []
activeVotingQuestion = False
########
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
        # Handler for getting the voting choices of a voting

        result = VotingChoiceDAO().getVotingChoiceByVID(vID)
        mapped_result = []

        if not result:
            return jsonify(Error="NOT FOUND"), 404

        else:
            for r in result:
                mapped_result.append(self.mapVotingChoiceByVID(r))

            return jsonify(Choice=mapped_result)



    def getActiveVotingChoiceByvID(self, vID):
        # Handler for getting the active voting alternatives of a voting
        global activeVotingQuestion
        global choiceResultArray
        result = VotingChoiceDAO().getActiveVotingChoiceByVID(vID)
        mapped_result = []

        if not result:
            return jsonify(Error="ACTIVE VOTING NOT FOUND"), 404

        else:
            for r in result:
                mapped_result.append(self.mapVotingChoiceByVID(r))
            ##This is new######################################
            #Stores the choices when there is an active voting question. Store the choices
            # once the first load is executed
            if (activeVotingQuestion == False):
                print(choiceResultArray)
                choiceResultArray = mapped_result
                activeVotingQuestion = True
            ####################################################
            return jsonify(Choice=mapped_result), 200

    ##NEW##########################################
    ##function that updates the choices as the user submit his/her choice
    def updateChoiceArray(self, json):
        global choiceResultArray
        choice = json.get('choice')
        for x in range(len(choiceResultArray)):
            if (choiceResultArray[x]['choice'] == choice):
                choiceResultArray[x]['votes'] = choiceResultArray[x]['votes'] + 1
                break
        print(choiceResultArray)
        return jsonify(choiceResultArray)

    ##Functions that gets the current updated choices with  its result
    def getChoiceResult(self):
        global choiceResultArray
        if (len(choiceResultArray) != 0):
            return jsonify(Choice=choiceResultArray), 201
        else:
            return jsonify(Error="Malformed update request"), 400
        ###########################################################

    def insertChoiceJSON(self, json):
    # Insert voting alternative

        vID = json.get('vID')
        choice = json.get('choice');
        votes = 0;

        if not VotingQuestionDAO().getVotingQuestionByID(vID):
            return jsonify(Error="VOTING NOT FOUND"), 404


        else:
            if vID and choice:

                altID = VotingChoiceDAO().insertVotingChoice(vID, choice, votes)
                mapped_result = self.builtVotingChoiceDict(altID, vID, choice, votes)
                return jsonify(Choice=mapped_result), 201

            else:

                return jsonify(Error="Unexpected attributes in post request"), 404


    def updateVotingChoice(self, form):
        ###NEW###
        global choiceResultArray
        global activeVotingQuestion
        if(activeVotingQuestion):
            choiceResultArray.clear()
            activeVotingQuestion = False
        print("array of choices",choiceResultArray)
        ########
        altID = form['altID']
        vID = form['vID']
        votes = form['votes']

        if not VotingChoiceDAO().getVotingChoiceByID(altID):
            return jsonify(Error="Voting Choice not found."), 404
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