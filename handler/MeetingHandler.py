from flask import jsonify, request
from dao.MeetingDAO import MeetingDAO


class MeetingHandler:


    def mapToMeetingInfoDict(self, row):
        # Meeting info dictionary
        result = {}
        result['mID'] = row[0]
        result['creator'] = row[1]
        result['mdate'] = row[2]
        result['mtime'] = row[3]
        result['mdescription'] = row[4]
        result['mstatus'] = row[5]
        return result


    def buildMeetingDict(self, mID, creator, mdate, mtime, mdescription, mstatus):

        result = {}
        result['mID'] = mID
        result['creator'] = creator
        result['mdate'] = mdate
        result['mtime'] = mtime
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
            return jsonify(Meeting=mapped_result)



    def updateMeetingStatus(self, form):

        if not MeetingHandler().getActiveMeeting():
            return jsonify(Error="Meeting not found."), 404
        else:
            if len(form) != 2:
                return jsonify(Error="Malformed update request"), 400
            else:

                mID = form['mID']
                mstatus = form['mstatus']

                if mID and mstatus:
                    MeetingDAO().updateMeetingStatus(mID, mstatus)
                    result = self.buildMeetingStatusDict(mID, mstatus)
                    return jsonify(Meeting=result), 201
                else:
                    return jsonify(Error="Unexpected attributes in update request"), 400


    def insertMeetingJSON(self, json):

        creator = json.get('creator')
        mdate = json.get('mdate')
        mtime = json.get('mtime');
        mdescription = json.get('mdescription');
        mstatus = json.get('mstatus');

        if creator and mdate and mtime and mstatus:

            mID = MeetingDAO().insert(creator,mdate,mtime,mdescription,mstatus)
            mapped_result = self.buildMeetingDict(mID, creator,mdate,mtime,mdescription,mstatus)
            return jsonify(Meeting = mapped_result), 201

        else:
            return jsonify(Error="Unexpected attributes in post request"), 404