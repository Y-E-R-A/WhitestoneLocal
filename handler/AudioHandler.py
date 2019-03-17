from flask import jsonify, request
from dao.AudioDAO import AudioDAO


class AudioHandler:

    def mapToAudioDict(self, row):
        result = {}
        result['aID'] = row[0]
        result['uID'] = row[1]
        result['mID'] = row[2]
        result['aname']= row[3]
        result['aadress'] = row[4]
        result['atype'] = row[5]
        return result


    def builtAudioDict(self, aID, uID, mID, aname, aaddress, atype):
        result ={}
        result['aID'] = aID
        result['uID'] = uID
        result['mID'] = mID
        result['aname'] = aname
        result['aadress'] = aaddress
        result['atype'] = atype
        return result


    def getAudioBymID(self, mID):

        result = AudioDAO.getAudioBymID(mID)
        mapped_result = []

        if not result:
            return jsonify(Error="NOT FOUND"), 404

        else:
            for r in result:
                mapped_result.append(self.mapToAudioDict(r))

            return jsonify(Audio=mapped_result)

    def insertCredentialsJSON(self, json):

        uID = json.get('uID')
        mID = json.get('mID')
        aname = json.get('aname');
        aaddress = json.get('aaddress');
        atype = json.get('atype');

        if uID and mID and aname and aaddress and atype:

            aID = AudioDAO().insert(uID, mID, aname, aaddress, atype)
            mapped_result = self.buildUserDict(aID, uID, mID, aname, aaddress, atype)
            return jsonify(Audio=mapped_result), 201

        else:
            return jsonify(Error="Unexpected attributes in post request"), 404

        