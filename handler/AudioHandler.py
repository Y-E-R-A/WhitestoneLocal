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


    def buildAudioToDict(self, aID, uID, mID, aname, aaddress, atype):
        result ={}
        result['aID'] = aID
        result['uID'] = uID
        result['mID'] = mID
        result['aname'] = aname
        result['aadress'] = aaddress
        result['atype'] = atype
        return result


    def getAudioByaID(self, aID):

        result = AudioDAO().getAudioByaID(aID)

        if not result:
            return jsonify(Error="NOT FOUND"), 404

        else:
            mapped_result = self.mapToAudioDict(result)

            return jsonify(Audio=mapped_result)


    def getAudioBymID(self, mID):

        result = AudioDAO().getAudioBymID(mID)
        mapped_result = []

        if not result:
            return jsonify(Error="NOT FOUND"), 404

        else:
            for r in result:
                mapped_result.append(self.mapToAudioDict(r))

            return jsonify(Audio=mapped_result)


    def getAudioByAddress(self, address):

        result = AudioDAO().getAudioByAddress(address)
        mapped_result = []

        if not result:
            return jsonify(Error="NOT FOUND"), 404

        else:
            for r in result:
                mapped_result.append(self.mapToAudioDict(r))

            return jsonify(Audio=mapped_result)


    def insertJSON(self, json):


        uID = json.get('uID')
        mID = json.get('mID')
        aname = json.get('aname');
        aaddress = json.get('aaddress');
        atype = json.get('atype');

        if uID and mID and aname and aaddress and atype:

            aID = AudioDAO().insert(uID, mID, aname, aaddress, atype)
            mapped_result = self.buildAudioToDict(aID, uID, mID, aname, aaddress, atype)
            return jsonify(Audio=mapped_result), 201

        else:
            return jsonify(Error="Unexpected attributes in post request"), 404

