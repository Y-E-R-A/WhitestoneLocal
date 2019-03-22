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
        result['localpassword'] = row[8]
        return result

    def mapToUserNamesDict(self, row):
        # Usernames dictionary
        result = {}
        result['firstname'] = row[0]
        result['lastname'] = row[1]
        return result
    def mapToUserIDDict(self, row):
        result = {}
        result['uID'] = row[0]
        return result

    def buildUserDict(self, uID, cID, ufirstname, ulastname, udescription, urole, uclassification):

        result = {}
        result['uID'] = uID
        result['cID'] = cID
        result['ufirstname'] = ufirstname
        result['ulastname'] = ulastname
        result['udescription'] = udescription
        result['urole'] = urole
        result['uclassification'] = uclassification
        return result


    def getAllUsersInfo(self):
        result = UsersDAO().getAllUsersInfo()
        mapped_result = []

        if not result:
            return jsonify(Error="NOT FOUND"), 404

        else:
            for r in result:
                mapped_result.append(self.mapToUserInfoDict(r))

            return jsonify(User=mapped_result)


    def getAllSenator(self):
        result = UsersDAO().getAllSenators()
        mapped_result = []

        if not result:
            return jsonify(Error="NOT FOUND"), 404

        else:
            for r in result:
                mapped_result.append(self.mapToUserIDDict(r))

            return jsonify(User=mapped_result)


    def getAllElectSenator(self):
        result = UsersDAO().getAllElectSenators()
        mapped_result = []

        if not result:
            return jsonify(Error="NOT FOUND"), 404

        else:
            for r in result:
                mapped_result.append(self.mapToUserIDDict(r))

            return jsonify(User=mapped_result)

    def getAllElectStudentsSenator(self):
        result = UsersDAO().getAllElectStudentSenators()
        mapped_result = []

        if not result:
            return jsonify(Error="NOT FOUND"), 404

        else:
            for r in result:
                mapped_result.append(self.mapToUserIDDict(r))

            return jsonify(User=mapped_result)



    def getAllExOfficioSenator(self):
        result = UsersDAO().getAllExOfficioSenators()
        mapped_result = []

        if not result:
            return jsonify(Error="NOT FOUND"), 404

        else:
            for r in result:
                mapped_result.append(self.mapToUserIDDict(r))

            return jsonify(User=mapped_result)



    def getAllExOfficioStudentsSenator(self):
        result = UsersDAO().getAllExOfficioStudentSenators()
        mapped_result = []

        if not result:
            return jsonify(Error="NOT FOUND"), 404

        else:
            for r in result:
                mapped_result.append(self.mapToUserIDDict(r))

            return jsonify(User=mapped_result)



    def getUserByEmail(self, email):

        result = UsersDAO().getUserbyEmail(email)
        mapped_result = []

        if not result:
            return jsonify(Error="NOT FOUND"), 404

        else:
            for r in result:
                mapped_result.append(self.mapToUserInfoDict(r))

            return jsonify(User=mapped_result)

    def getUserByuID(self, uID):

        result = UsersDAO().getUserByuID(uID)
        mapped_result = []

        if not result:
            return jsonify(Error="NOT FOUND"), 404

        else:
            for r in result:
                mapped_result.append(self.mapToUserInfoDict(r))

            return jsonify(User=mapped_result)

    def insertCredentialsJSON(self,json):

        cid = json.get('cID')
        ufirstname = json.get('ufirstname')
        ulastname = json.get('ulastname');
        udescription = json.get('udescription');
        urole = json.get('urole');
        uclassification = json.get('uclassification');

        if cid and ufirstname and ulastname and urole and uclassification:

            uid = UsersDAO().insert(cid,ufirstname,ulastname,udescription,urole, uclassification)
            mapped_result = self.buildUserDict(uid,cid,ufirstname,ulastname,udescription,urole, uclassification)
            return jsonify(User = mapped_result), 201

        else:
            return jsonify(Error="Unexpected attributes in post request"), 404



    def updateUser(self, uID, form):

        if not UsersDAO().getUserByuID(uID):
            return jsonify(Error="User not found."), 404
        else:
            if len(form) != 7:
                return jsonify(Error="Malformed update request"), 400
            else:

                uID = form['uID']
                cID = form['cID']
                ufirstname = form['ufirstname']
                ulastname = form['ulastname']
                udescription = form['udescription']
                urole = form['urole']
                uclassification = form['uclassification']


                if ufirstname and ulastname and urole and uclassification:
                    UsersDAO().update(ufirstname, ulastname, udescription, urole, uclassification)
                    result = self.buildUserDict(uID, cID, ufirstname, ulastname, udescription, urole, uclassification)
                    return jsonify(User=result), 201
                else:
                    return jsonify(Error="Unexpected attributes in update request"), 400