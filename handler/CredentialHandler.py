from flask import jsonify, request
from dao.CredentialDAO import CredentialDAO
from dao.UsersDAO import UsersDAO


class CredentialHandler:

    def mapToCredentialDict(self, row):
        # Map the credentials information to dictionary
        result = {}
        result['email'] = row[0]
        result['pin'] = row[1]
        return result

    def buildCredentialDict(self, cID, email, pin):
        # Built the credentials dictionary
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

            return jsonify(AllCredentials=mapped_result), 200


    def getCredentialByEmail(self, email):
        # Handle credential information (cID, email, pin) of a user with certain email
        result = CredentialDAO().getCredentialById(email)
        if not result:
            return jsonify(Error="USER NOT FOUND"), 404
        else:
            mapped_result = self.mapToCredentialDict(result)
            return jsonify(Credential=mapped_result), 200


    def insertCredentialJSON(self,json):
        # Handle new user's credentials insertions
        email = json.get('email')
        pin = json.get('pin')

        if CredentialDAO().getCredentialByEmail(email):

            return jsonify(Error="Email already registered"), 400
        else:
            if email and pin:
                cID = CredentialDAO().insert(email, pin)
                mapped_result = self.buildCredentialDict(cID,email, pin)
                return jsonify(Credential=mapped_result), 201

            else:
                return jsonify(Error="Unexpected attributes in post request"), 400


    def updateCredential(self, form):
        # Handle the email and pin updates for user with certain cID
        user = UsersDAO().getUserbyEmail(form['email'])


        if (user and (user[7] == form['email'] and user[1] == form['cID'])) or not user:
            if len(form) != 3:

                return jsonify(Error="Malformed update request"), 400

            else:

                cID = form['cID']
                email = form['email']
                pin = form['pin']

                if cID and email and pin:
                    CredentialDAO().updateCredentials(email, pin, cID)
                    result = self.buildCredentialDict(cID, email, pin)
                    return jsonify(Credential=result), 200

                else:
                    return jsonify(Error="Unexpected attributes in update request"), 400
        else:
            return jsonify(Error="Email is already registered."), 400




    # def updateAllPins(self):
    #     credential = CredentialDAO().getAllCredentials()
    #     if not credential:
    #         return jsonify(Error="No users credentials found."), 404
    #     else:
    #         CredentialDAO().updateAllPins()
    #
    #         return self.getAllCredentials()



