from flask import jsonify, request
from dao.MeetingDAO import MeetingDAO


class MeetingHandler:


    def mapToMeetingInfoDict(self, row):
        # Meeting info dictionary
        result = {}
        result['mID'] = row[0]
        result['creatorID'] = row[1]
        result['mdate'] = row[2]
        result['mtime'] = row[3]
        result['mdescription'] = row[4]
        result['mstatus'] = row[5]
        return result


    def buildMeetingDict(self, mID, creatorID, mdate, mtime, mdescription, mstatus):

        result = {}
        result['mID'] = mID
        result['creatorID'] = creatorID
        result['mdate'] = mdate
        result['mtime'] = mtime
        result['mdescription'] = mdescription
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





    def insertCredentialsJSON(self,json):

        creatorID = json.get('creatorID')
        mdate = json.get('mdate')
        mtime = json.get('mtime');
        mdescription = json.get('mdescription');
        mstatus = json.get('mstatus');

        if creatorID and mdate and mtime and mstatus:

            mID = MeetingDAO().insert(creatorID,mdate,mtime,mdescription,mstatus)
            mapped_result = self.buildMeetingDict(mID, creatorID,mdate,mtime,mdescription,mstatus)
            return jsonify(Meeting = mapped_result), 201

        else:
            return jsonify(Error="Unexpected attributes in post request"), 404