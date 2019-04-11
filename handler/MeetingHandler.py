from flask import jsonify, request
from dao.MeetingDAO import MeetingDAO


class MeetingHandler:


    def mapToMeetingInfoDict(self, row):
        # Meeting info dictionary
        result = {}
        result['mID'] = row[0]
        result['mdate'] = str(row[1])
        result['mtime'] = str(row[2])
        result['mname'] = str(row[3])
        result['mdescription'] = row[4]
        result['mstatus'] = row[5]
        return result


    def buildMeetingDict(self, mID, mdate, mtime, mname, mdescription, mstatus):

        result = {}
        result['mID'] = mID
        result['mdate'] = str(mdate)
        result['mtime'] = str(mtime)
        result['mname'] = mname
        result['mdescription'] = mdescription
        result['mstatus'] = mstatus
        return result


    def buildMeetingStatusDict(self, mID, mstatus):
        result = {}
        result['mID'] = mID
        result['mstatus'] = mstatus
        return result


    def getOldMeetings(self):

        result = MeetingDAO().getOldMeetings()
        mapped_result = []

        if not result:
            return jsonify(Error="NOT FOUND"), 404

        else:
            for r in result:
                mapped_result.append(self.mapToMeetingInfoDict(r))

            return jsonify(Meeting=mapped_result)

    def getActiveMeeting(self):

        result = MeetingDAO().getActiveMeeting()
        mapped_result = []

        if not result:
            return jsonify(Error="NOT FOUND"), 404
        else:
            for r in result:
                mapped_result.append(self.mapToMeetingInfoDict(r))
            return jsonify(Meeting=mapped_result), 200



    def updateMeetingStatus(self, form):

        mID = form['mID']
        mstatus = "Inactive"

        if not MeetingDAO().getMeetingBymID(mID):
            return jsonify(Error="Meeting does not exist "), 404

        else:
            if len(form) != 1:
                return jsonify(Error="Malformed update request"), 400
            else:

                if mID and mstatus:
                    MeetingDAO().updateMeetingStatus(mID, mstatus)
                    result = self.buildMeetingStatusDict(mID, mstatus)
                    return jsonify(Meeting=result), 201
                else:
                    return jsonify(Error="Unexpected attributes in update request"), 400


    def insertMeetingJSON(self, json):


        mdate = json.get('mdate')
        mtime = json.get('mtime');
        mname = json.get('mname');
        mdescription = json.get('mdescription');
        mstatus = json.get('mstatus');


        if mname and mdate and mtime and mstatus:

            mID = MeetingDAO().insertMeeting(mdate, mtime, mname, mdescription, mstatus)
            mapped_result = self.buildMeetingDict(mID, mdate, mtime, mname, mdescription,mstatus)
            return jsonify(Meeting = mapped_result), 201

        else:
            return jsonify(Error="Unexpected attributes in post request"), 404