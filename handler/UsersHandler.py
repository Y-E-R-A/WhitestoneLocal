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


    def getAllUserNames(self):
        #
        result = UsersDAO.getAllUserNames()
        mapped_result = []

        if not result:
            return jsonify(Error="NOT FOUND"), 404

        else:
            for r in result:
                mapped_result.append(self.mapToUserNamesDict(r))

            return jsonify(User=mapped_result)



    def getUserbyEmail(self, email):
        #
        result = UsersDAO.getUserbyEmail(email)
        mapped_result = []

        if not result:
            return jsonify(Error="NOT FOUND"), 404

        else:
            for r in result:
                mapped_result.append(self.mapToUserInfoDict(r))

            return jsonify(User=mapped_result)


    def getUserByFullName(self, firstname, lastname):
        #
        result = UsersDAO.getUserByFullName(firstname, lastname)
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