from configs.dbconfig import pg_config
import psycopg2

class MeetingDAO:

    def __init__(self):
        connection_url = "dbname=%s user=%s password=%s" % (pg_config['dbname'],

                                                            pg_config['user'],

                                                            pg_config['passwd'])

        self.conn = psycopg2._connect(connection_url)


    def getOldMeetings(self):
        # Return all the old or inactive meeting information
        cursor = self.conn.cursor()
        query = " SELECT * " \
                "FROM Meeting " \
                "WHERE mstatus = 'Inactive';"
        cursor.execute(query)
        result = []
        for row in cursor:
            result.append(row)
        return result

    def getActiveMeeting(self):
        # Return all the old or inactive meeting information
        cursor = self.conn.cursor()
        query = " SELECT * " \
                "FROM Meeting " \
                "WHERE mstatus = 'Active';"
        cursor.execute(query)
        result = []
        for row in cursor:
            result.append(row)
        return result

    def updateMeetingStatus(self, mID, mstatus):
        # Modify the meeting status (Active or Inactive)
        cursor = self.conn.cursor()
        query = "UPDATE Meeting " \
                "SET mstatus = %s " \
                "WHERE mID = %s"
        cursor.execute(query, (mstatus, mID, ))
        self.conn.commit()


    def insert(self, creatorID, mdate, mtime, mdescription, mstatus):
        # Insert a new meeting session in the table Meeting
        cursor = self.conn.cursor()
        query = "INSERT INTO Meeting(creatorID, mdate, mtime. mdescription, mstatus) " \
            "VALUES (%s, %s, %s, %s, %s, %s);"
        cursor.execute(query, (creatorID, mdate, mtime, mdescription, mstatus,))
        mid = cursor.fetchone()[0]
        self.conn.commit()
        return mid


