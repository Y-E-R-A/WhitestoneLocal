from flask import jsonify, request
from dao.ActivityLogDAO import ActivityLogDAO


class ActivityLogHandler:

    def mapToActivityLogDict(self, row):

        result = {}
        result['date'] = row[0]
        result['time'] = str(row[1])
        result['urole'] = str(row[2])
        result['email'] = row[3]
        result['logmessage'] = row[4]
        return result


    def builtActivityLogDict(self, logID, urole, email, time, date, logmessage):
        result = {}
        result['logID'] = logID
        result['urole'] = urole
        result['email'] = email
        result['date'] = str(date)
        result['time'] = str(time)
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


    def insertActivityLogJSON(self, json):

        urole = json.get('urole')
        uemail = json.get('uemail')
        date= json.get('date')
        time= json.get('time')
        logmessage= json.get('logmessage')

        if urole and uemail and date and time and logmessage:
            logID = ActivityLogDAO().insertActivityLog(urole, uemail, date, time, logmessage)
            mapped_result = self.builtActivityLogDict(logID, urole, uemail, time, date, logmessage)
            return jsonify(Log=mapped_result), 201
        else:

            return jsonify(Error="Unexpected attributes in post request"), 404
