from flask import jsonify, request
from dao.ActivityLogDAO import ActivityLogDAO


class ActivityLogHandler:

    def mapToActivityLogDict(self, row):

        result = {}
        result['logcreation']= row[0]
        result['ufirstname']= row[1]
        result['ulastname'] = row[2]
        result['logmessage'] = row[2]
        return result


    def builtActivityLogDict(self, logID, uID, logcreation, logmessage):
        result = {}
        result['logID'] = logID
        result['uID'] = uID
        result['logcreation']= logcreation
        result['logmessage'] = logmessage
        return result


    def getActivityLogByDate(self, date):

        result = ActivityLogDAO().getActivityLogByDate(date)
        mapped_result = []

        if not result:
            return jsonify(Error="NOT FOUND"), 404

        else:
            for r in result:
                mapped_result.append(self.mapToActivityLogDict(r))

            return jsonify(Log = mapped_result)


    def insertCredentialsJSON(self, json):

        uID = json.get('uID')
        logcreation = json.get('logcreation')
        logmessage= json.get('logmessage')

        if uID and logcreation and logmessage:
            logID = ActivityLogDAO().insert(uID, logcreation, logmessage)
            mapped_result = self.builtActivityLogDict(logID, uID, logcreation, logmessage)
            return jsonify(Log = mapped_result), 201
        else:

            return jsonify(Error="Unexpected attributes in post request"), 404
