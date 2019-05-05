from flask import jsonify
from dao.RequestsDAO import RequestsDAO


class RequestsHandler:

    def buildRequestToDict(self, uID, request, approval):
        result = {}
        result['uID'] = uID
        result['request'] = request
        result['approval'] = approval
        return result

    def buildApprovalToDict(self, uID, approval):
        result = {}
        result['uID'] = uID
        result['approval'] = approval
        return result

    def buildCheckRequestToDict(self, uID, request):
       result = {}
       result['uID'] = uID
       result['request'] = request
       return result

    def mapToUserRequestDict(self, row):
        result = {}
        result['rID'] = row[0]
        result['uID'] = row[1]
        result['request'] = row[2]
        result['approval'] = row[3]
        result['uname'] = row[4]
        result['ulastname'] = row[5]
        return result

    def submitRequest(self, json):
        uID= json.get('uID')
        request = True
        approval = "Wait"
        if uID:

            RequestsDAO().insertRequest(uID, request, approval)
            mapped_result = self.buildRequestToDict(uID, request, approval)
            return jsonify(TURN=mapped_result), 201

        else:
            return jsonify(Error="Unexpected attributes in post request"), 400


    def cancelRequest(self, json):
        uID = json.get('uID')
        print(RequestsDAO().getRequestByuID(uID))
        if not RequestsDAO().getRequestByuID(uID):
            return jsonify(Error="No request found"), 404
        else:

            if uID:
                RequestsDAO().deleteRequest(uID)
                return jsonify(User="User deleted"), 200
            else:
                return jsonify(Error="Unexpected attributes in update request"), 400


    def checkApproval(self, json):
        # Handles the information about the speak turn approval
        uID = json.get('uID')
        if not RequestsDAO().getRequestByuID(uID):
            return jsonify(Error="No request found"), 404
        else:
            if uID:
                approval = RequestsDAO().getApprovalStatusByuID(uID)
                mapped_result = self.buildApprovalToDict(uID, approval)
                return jsonify(TURN=mapped_result), 200

            else:
                return jsonify(Error="Unexpected attributes in post request"), 400



    def checkRequest(self, uID):
        # Handles the information about the speak turn approval
        print("CHECK REQ: ",uID)
        print(RequestsDAO().getRequestByuID(uID))
        if not RequestsDAO().getRequestByuID(uID):
            return jsonify(Error="No request found"), 404
        else:
            if uID:
                approval = RequestsDAO().getRequestStatusByuID(uID)
                mapped_result = self.buildCheckRequestToDict(uID, approval)
                return jsonify(TURN=mapped_result), 200

            else:
                return jsonify(Error="Unexpected attributes in post request"), 400



    def clearList(self):

        if not RequestsDAO().getRequests():
            return jsonify(Error="No requests found"), 404
        else:

            RequestsDAO().truncateTurnTable()
            return jsonify(TURN="Table content was deleted"), 200

    def grantRequest(self, json):
        uID = json.get('uID')
        if not RequestsDAO().getRequestByuID(uID):
            return jsonify(Error="User speak request not found"), 404
        else:
            approval = RequestsDAO().grantTurn(uID)
            mapped_result = self.buildApprovalToDict(uID, approval)
            return jsonify(TURN=mapped_result), 200



    def denyRequest(self, json):
        uID = json.get('uID')
        if not RequestsDAO().getRequestByuID(uID):
            return jsonify(Error="User speak request not found"), 404
        else:
            approval = RequestsDAO().denyTurn(uID)
            mapped_result = self.buildApprovalToDict(uID, approval)
            return jsonify(TURN=mapped_result), 200



    def getRequestList(self):

        result = RequestsDAO().getRequests()
        mapped_result = []

        if not result:
            return jsonify(Error="NOT FOUND"), 404

        else:
            for r in result:
                mapped_result.append(self.mapToUserRequestDict(r))

            return jsonify(TURN=mapped_result), 200