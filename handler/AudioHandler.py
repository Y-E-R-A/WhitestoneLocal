from flask import jsonify, request
from dao.AudioDAO import AudioDAO
from dao.MeetingDAO import MeetingDAO

###NEW##
requestList = []
########
class AudioHandler:

    def mapToAudioDict(self, row):
        result = {}
        result['aID'] = row[0]
        result['mID'] = row[1]
        result['aname']= row[2]
        result['aadress'] = row[3]
        result['atype'] = row[4]
        return result


    def buildAudioToDict(self, aID, mID, aname, aaddress, atype):
        result ={}
        result['aID'] = aID
        result['mID'] = mID
        result['aname'] = aname
        result['aadress'] = aaddress
        result['atype'] = atype
        return result


    def getAudioByaID(self, aID):
        # Handle information of an audio specified by aID
        result = AudioDAO().getAudioByaID(aID)

        if not result:
            return jsonify(Error="NOT FOUND"), 404

        else:
            mapped_result = self.mapToAudioDict(result)

            return jsonify(Audio=mapped_result)


    def getAudioBymID(self, mID):
        # Handle information of all the audios
        # that belong to a meeting specified by mID

        result = AudioDAO().getAudioBymID(mID)
        mapped_result = []

        if not result:
            return jsonify(Error="NOT FOUND"), 404

        else:
            for r in result:
                mapped_result.append(self.mapToAudioDict(r))

            return jsonify(Audio=mapped_result)


    def getAudioByAddress(self, address):
        # Handle information of the audio specified by an address
        result = AudioDAO().getAudioByAddress(address)
        mapped_result = []

        if not result:
            return jsonify(Error="NOT FOUND"), 404

        else:
            for r in result:
                mapped_result.append(self.mapToAudioDict(r))

            return jsonify(Audio=mapped_result)

    ##NEW##########################################
    ##function that updates the choices as the user submit his/her choice
    def submitRequest(self, json):
        global requestList
        fname = json.get('fname')
        lname = json.get('lname')
        requestedTurn = json.get('requestedTurn')
        turnApproved = json.get('turnApproved')
        requestList.append(json)
        #for x in range(len(requestList)):
        print("Request submit", requestList)
        return jsonify(TURN=requestList), 201

    def cancelRequest(self, json):
        global requestList
        uid = json.get('uid')
        print("UID: ",uid)
        index =-1
        for x in range(len(requestList)):
            print("req: ",requestList[x])
            if(uid == requestList[x]['uid']):
                index = x
                break
        if(index>=0):
            requestList.pop(index)
            print("Request List cancel: ", requestList)
            return jsonify(TURN=requestList), 200
        else:
            print("cannot cancel")
            return jsonify(ERROR="Could not remove user"), 400

    def checkApproval(self, json):
        global requestList
        uid = json.get('uid')
        index = 0
        boolean = False;
        for x in range(len(requestList)):
            if (uid == requestList[x]['uid']):
                if(requestList[x]['turnApproved']):
                    print("YEAH")
                    index = x
                    boolean = True
                    break
        if requestList:
            if(requestList[x]['requestDenied']):
                return jsonify(ERROR="Request Denied"), 400# request is denied
            if(boolean):
                return jsonify(TURN=requestList[index]), 200
            else:
                return jsonify(ERROR="NOT FOUND"), 404## Request is in list, but not approved or denied
        else:
            print("empty")
            return jsonify(ERROR="NOT FOUND"), 400#

    def checkRequest(self, uid):
        global requestList
        index = 0
        boolean = False;
        print("Hi there")
        for x in range(len(requestList)):
            print("In loop")
            if (uid == requestList[x]['uid']):
                if(requestList[x]['requestedTurn']):
                    print(requestList[x]['requestedTurn'])
                    print("In here baby")
                    index = x
                    boolean = True
                    break
        if(boolean):
            return jsonify(TURN=requestList[index]), 200
        else:
            return jsonify(Error="NOT FOUND"), 404

    def clearList(self, json):
        global requestList
        requestList = []
        print(requestList)
        return jsonify(TURN=requestList), 201

    def grantRequest(self, json):
        global requestList
        boolean = False
        for x in range(len(requestList)):
            print("In loop")
            if (json.get('uid') == requestList[x]['uid']):
                requestList[x]['turnApproved'] = True
                print(requestList[x])
                print("henshin baby")
                index = x
                boolean = True
                break
        if(boolean):
            return jsonify(TURN=requestList[index]), 201
        else:
            return jsonify(Error="Could not grant request"), 400

    def denyRequest(self, json):
        global requestList
        uid = json.get('uid')
        print("UID: ",uid)
        index =-1
        for x in range(len(requestList)):
            print("req: ",requestList[x])
            if(uid == requestList[x]['uid']):
                requestList[x]['requestDenied'] = True
                index = x
                break
        if(index>=0):
            print("Request List denied: ", requestList)
            return jsonify(TURN=requestList), 201
        else:
            return jsonify(ERROR="Could not deny user"), 400

    def getRequestList(self):
        global requestList
        if not requestList:
            return jsonify(ERROR="Turn list is empty"), 404
        else:
            return jsonify(Turn=requestList), 200

    #####################################################
    def insertAudioJSON(self, json):
        # Handle information insertion of a new audio file
        mID = json.get('mID')
        aname = json.get('aname');
        aaddress = json.get('aaddress');
        atype = json.get('atype');

        if not MeetingDAO().getMeetingBymID(mID):
            return jsonify(Error="MEETING NOT EXIST"), 400

        else:

            if mID and aname and aaddress and atype:

                aID = AudioDAO().insert(mID, aname, aaddress, atype)
                mapped_result = self.buildAudioToDict(aID, mID, aname, aaddress, atype)
                return jsonify(Audio=mapped_result), 201

            else:
                return jsonify(Error="Unexpected attributes in post request"), 400