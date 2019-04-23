from flask import jsonify, request
from dao.ActivityLogDAO import ActivityLogDAO
import datetime

class ActivityLogHandler:

    def mapToActivityLogDict(self, row):
        # Map the activity log information to dictionary
        result = {}
        result['date'] = row[0]
        result['time'] = str(row[1])
        result['urole'] = str(row[2])
        result['email'] = row[3]
        result['logmessage'] = row[4]
        return result


    def builtActivityLogDict(self, logID, urole, email, time, date, logmessage):
        # Built the activity log information to dictionary, includes logID
        result = {}
        result['logID'] = logID
        result['urole'] = urole
        result['email'] = email
        result['date'] = str(date)
        result['time'] = str(time)
        result['logmessage'] = logmessage
        return result


    def getActivityLogByDate(self, date):
        # Handle the search of the activity log by date
        day, month, year = date.split('/')

        isValidDate = True
        try:
            datetime.datetime(int(year), int(month), int(day))
        except ValueError:
            isValidDate = False

        if (isValidDate):
            result = ActivityLogDAO().getActivityLogByDate(date)
            mapped_result = []

            if not result:
                return jsonify(Error="NOT FOUND"), 404

            else:
                for r in result:
                    mapped_result.append(self.mapToActivityLogDict(r))
                return jsonify(Log=mapped_result), 200

        else:
            return jsonify(Error="Unexpected attributes in post request"), 400


    def insertActivityLogJSON(self, json):
        # Handle the insertion of a new activity log
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

            return jsonify(Error="Unexpected attributes in post request"), 400
