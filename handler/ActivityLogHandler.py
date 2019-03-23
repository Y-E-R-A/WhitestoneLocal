from flask import jsonify, request
from dao.ActivityLogDAO import ActivityLogDAO


class ActivityLogHandler:

    def mapToActivityLogDict(self, row):

        result = {}
        result['date']= row[0]
        result['time']= row[1]
        result['ufirstname']= row[2]
        result['ulastname'] = row[3]
        result['logmessage'] = row[4]
        return result


    def builtActivityLogDict(self, logID, uID, time, date, logmessage):
        result = {}
        result['logID'] = logID
        result['uID'] = uID
        result['date']= date
        result['time']= time
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
        date= json.get('date')
        time= json.get('time')
        logmessage= json.get('logmessage')

        if uID and date and time and logmessage:
            logID = ActivityLogDAO().insert(uID, date, time, logmessage)
            mapped_result = self.builtActivityLogDict(logID, uID, time, date, logmessage)
            return jsonify(Log = mapped_result), 201
        else:

            return jsonify(Error="Unexpected attributes in post request"), 404
