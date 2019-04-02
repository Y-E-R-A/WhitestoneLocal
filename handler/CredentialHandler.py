from flask import jsonify, request
from dao.CredentialDAO import CredentialDAO
from dao.UsersDAO import UsersDAO


class CredentialHandler:

    def mapToCredentialDict(self, row):
        result = {}
        result['email'] = row[0]
        result['localpassword'] = row[1]
        return result

    def buildCredentialDict(self, ID, email, localpassword):
        result = {}
        result['ID'] = ID
        result['email'] = email
        result['localpassword'] = localpassword
        return result

    def getAllCredentials(self):
        result = CredentialDAO().getAllCredentials()
        mapped_result = []

        if not result:
            return jsonify(Error="NOT FOUND"), 404

        else:
            for r in result:
                mapped_result.append(self.mapToCredentialDict(r))

            return jsonify(AllCredentials =mapped_result)


    def getCredentialByEmail(self, email):

        result = CredentialDAO().getCredentialById(email)
        if not result:

            return jsonify(Error="USER NOT FOUND"), 404

        else:

            mapped_result = self.mapToCredentialDict(result)

            return jsonify(Credential = mapped_result)


    def insertCredentialJSON(self,json):
        email = json.get('email')
        localpassword = json.get('localpassword')
        if UsersDAO().getUserbyEmail(email):

            return jsonify(Error="Email already registered"),
        else:
            if email and localpassword:
                ID = CredentialDAO().insert(email, localpassword)
                mapped_result = self.buildCredentialDict(ID,email, localpassword)
                return jsonify(Credential = mapped_result), 201

            else:
                return jsonify(Error="Unexpected attributes in post request"), 404

    def updateCredential(self, form):
        credential = CredentialDAO().getCredentialByEmail(form['email'])
        if not credential:
            return jsonify(Error="User not found."), 404
        else:
            if len(form) != 3:

                return jsonify(Error="Malformed update request"), 400

            else:

                ID = form['ID']
                email = form['email']
                pin = form['localpassword']

                if ID and email and pin:
                    CredentialDAO().update(email, pin, ID)
                    result = self.buildCredentialDict(ID, email, pin)
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



