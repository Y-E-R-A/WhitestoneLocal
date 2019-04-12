from flask import jsonify, request
from dao.UsersDAO import UsersDAO


class UsersHandler:

    def mapToUserInfoDict(self, row):

        # User info dictionary
        result = {}
        result['uid'] = row[0]
        result['cid'] = row[1]
        result['firstname'] = row[2]
        result['lastname'] = row[3]
        result['about'] = row[4]
        result['role'] = row[5]
        result['classification'] = row[6]
        result['email'] = row[7]
        result['pin'] = row[8]
        return result

    def mapToUserNamesDict(self, row):
        # Usernames dictionary
        result = {}
        result['firstname'] = row[0]
        result['lastname'] = row[1]
        return result


    def mapToUserIDDict(self, row):
        # User ID dictionary
        result = {}
        result['uID'] = row[0]
        return result

    def buildUserDict(self, uID, cID, ufirstname, ulastname, udescription, urole, uclassification):
        # Built a user dictionary
        result = {}
        result['uID'] = uID
        result['cID'] = cID
        result['ufirstname'] = ufirstname
        result['ulastname'] = ulastname
        result['udescription'] = udescription
        result['urole'] = urole
        result['uclassification'] = uclassification
        return result

    def editUserDict(self, uID, ufirstname, ulastname, udescription, urole, uclassification):
        # Built a edited user dictionary
        result = {}
        result['uID'] = uID
        result['ufirstname'] = ufirstname
        result['ulastname'] = ulastname
        result['udescription'] = udescription
        result['urole'] = urole
        result['uclassification'] = uclassification
        return result

    def getAllUsersInfo(self):
        # Handle the search of all users information
        result = UsersDAO().getAllUsersInfo()
        mapped_result = []

        if not result:
            return jsonify(Error="NOT FOUND"), 404

        else:
            for r in result:
                mapped_result.append(self.mapToUserInfoDict(r))

            return jsonify(User=mapped_result), 200


    def getAllSenator(self):
        # Handle the search of all the uID of users with senator role
        result = UsersDAO().getAllSenators()
        mapped_result = []

        if not result:
            return jsonify(Error="NOT FOUND"), 404

        else:
            for r in result:
                mapped_result.append(self.mapToUserIDDict(r))

            return jsonify(User=mapped_result), 200


    def getAllElectSenator(self):
        # Handle the search of uID with the elect senator classification
        result = UsersDAO().getAllElectSenators()
        mapped_result = []

        if not result:
            return jsonify(Error="NOT FOUND"), 404

        else:
            for r in result:
                mapped_result.append(self.mapToUserIDDict(r))

            return jsonify(User=mapped_result),200

    def getAllElectStudentsSenator(self):
        # Handle the search of uID with the elect student senator classification
        result = UsersDAO().getAllElectStudentSenators()
        mapped_result = []

        if not result:
            return jsonify(Error="NOT FOUND"), 404

        else:
            for r in result:
                mapped_result.append(self.mapToUserIDDict(r))

            return jsonify(User=mapped_result), 200



    def getAllExOfficioSenator(self):
        # Handle the search of uID with the ex-officio senator classification
        result = UsersDAO().getAllExOfficioSenators()
        mapped_result = []

        if not result:
            return jsonify(Error="NOT FOUND"), 404

        else:
            for r in result:
                mapped_result.append(self.mapToUserIDDict(r))

            return jsonify(User=mapped_result), 200



    def getAllExOfficioStudentsSenator(self):
        # Handle the search of uID with the ex-officio student senator classification
        result = UsersDAO().getAllExOfficioStudentSenators()
        mapped_result = []

        if not result:
            return jsonify(Error="NOT FOUND"), 404

        else:
            for r in result:
                mapped_result.append(self.mapToUserIDDict(r))

            return jsonify(User=mapped_result), 200



    def getUser(self, json):
        # Handle the search of user information according to the login type
        login = json.get("login")
        email = json.get('email')
        pin = json.get("pin")

        if login == "LOCAL":
            result = UsersDAO().getUser(email, pin)
            if not result:
                return jsonify(Error="NOT FOUND"), 404

            else:

                mapped_result = self.mapToUserInfoDict(result)
                return jsonify(User=mapped_result), 200

        else:
            result = UsersDAO().getUserbyEmail(email)
            if not result:
                return jsonify(Error="NOT FOUND"), 404

            else:

                mapped_result = self.mapToUserInfoDict(result)
                return jsonify(User=mapped_result), 200



    def getUserByuID(self, uID):
        # Handle the search of user information with certain uID
        result = UsersDAO().getUserByuID(uID)
        if not result:
            return jsonify(Error="NOT FOUND"), 404

        else:

            mapped_result = self.mapToUserInfoDict(result)
            return jsonify(User=mapped_result), 200

    def insertUserJSON(self, json):
        # Handle the insertion of a new user

        cid = json.get('cID')
        ufirstname = json.get('ufirstname')
        ulastname = json.get('ulastname');
        udescription = json.get('udescription');
        urole = json.get('urole');
        uclassification = json.get('uclassification');

        if UsersDAO().getUserBycID(cid):

            return jsonify(Error="The credential ID belong to other user"), 400
        else:

            if cid and ufirstname and ulastname and urole and uclassification:

                uid = UsersDAO().insert(cid,ufirstname,ulastname,udescription,urole, uclassification)
                mapped_result = self.buildUserDict(uid,cid,ufirstname,ulastname,udescription,urole, uclassification)
                return jsonify(User = mapped_result), 201

            else:
                return jsonify(Error="Unexpected attributes in post request"), 400



    def updateUser(self, uID, form):
        # Handle the update of user information with certain uID
        if not UsersDAO().getUserByuID(uID):
            return jsonify(Error="User not found"), 404
        else:

            if len(form) != 5:
                return jsonify(Error="Malformed update request"), 400
            else:


                ufirstname = form['ufirstname']
                ulastname = form['ulastname']
                udescription = form['udescription']
                urole = form['urole']
                uclassification = form['uclassification']


                if ufirstname and ulastname and urole and uclassification:
                    UsersDAO().updateUser(uID, ufirstname, ulastname, udescription, urole, uclassification)
                    result = self.editUserDict(uID, ufirstname, ulastname, udescription, urole, uclassification)
                    return jsonify(User=result), 200
                else:
                    return jsonify(Error="Unexpected attributes in update request"), 400



    def deleteUser(self, uID):
        # Handle the cascade deletion of a user, its credentials, and vote in relations
        if not UsersDAO().getUserByuID(uID):
            return jsonify(Error="User not found"), 404

        else:

            UsersDAO().deleteUser(uID)
            return jsonify(Action="User deleted"), 200





