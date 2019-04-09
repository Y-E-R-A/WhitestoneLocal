from flask import jsonify, request
from dao.CredentialDAO import CredentialDAO
from dao.UsersDAO import UsersDAO


class CredentialHandler:

    def mapToCredentialDict(self, row):
        result = {}
        result['email'] = row[0]
        result['pin'] = row[1]
        return result

    def buildCredentialDict(self, cID, email, pin):
        result = {}
        result['cID'] = cID
        result['email'] = email
        result['pin'] = pin
        return result

    def getAllCredentials(self):
        # Handle the email, and pin information of all users registered
        result = CredentialDAO().getAllCredentials()
        mapped_result = []

        if not result:
            return jsonify(Error="CREDENTIALS NOT FOUND"), 404

        else:
            for r in result:
                mapped_result.append(self.mapToCredentialDict(r))

            return jsonify(AllCredentials=mapped_result)


    def getCredentialByEmail(self, email):
        # Handle credential information (cID, email, pin) of a user with certain email
        result = CredentialDAO().getCredentialById(email)
        if not result:
            return jsonify(Error="USER NOT FOUND"), 404
        else:
            mapped_result = self.mapToCredentialDict(result)
            return jsonify(Credential=mapped_result)


    def insertCredentialJSON(self,json):
        # Handle new user's credentials insertions
        email = json.get('email')
        pin = json.get('pin')
        if UsersDAO().getUserbyEmail(email):

            return jsonify(Error="Email already registered"),
        else:
            if email and pin:
                cID = CredentialDAO().insert(email, pin)
                mapped_result = self.buildCredentialDict(cID,email, pin)
                return jsonify(Credential = mapped_result), 201

            else:
                return jsonify(Error="Unexpected attributes in post request"), 404

    def updateCredential(self, form):
        # Handle the email and pin updates for user with certain cID
        credential = CredentialDAO().getCredentialByEmail(form['email'])
        if not credential:
            return jsonify(Error="User not registered."), 404
        else:
            if len(form) != 3:

                return jsonify(Error="Malformed update request"), 400

            else:

                cID = form['cID']
                email = form['email']
                pin = form['pin']

                if cID and email and pin:
                    CredentialDAO().update(email, pin, cID)
                    result = self.buildCredentialDict(cID, email, pin)
                    return jsonify(Credential=result), 201

                else:
                    return jsonify(Error="Unexpected attributes in update request"), 400

    # def updateAllPins(self):
    #     credential = CredentialDAO().getAllCredentials()
    #     if not credential:
    #         return jsonify(Error="No users credentials found."), 404
    #     else:
    #         CredentialDAO().updateAllPins()
    #
    #         return self.getAllCredentials()



