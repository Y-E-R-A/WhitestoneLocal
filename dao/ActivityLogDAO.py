from configs.dbconfig import pg_config
import psycopg2

class ActivityLogDAO:

    def __init__(self):
        connection_url = "dbname=%s user=%s password=%s" % (pg_config['dbname'],

                                                            pg_config['user'],

                                                            pg_config['passwd'])

        self.conn = psycopg2._connect(connection_url)


    def getActivityLogByDate(self, date):
        # Return all the activities that occurs in certain date
        cursor = self.conn.cursor()
        query = "SELECT logcreation, ufirstname, ulastname, logmessage " \
                "FROM ActivityLog NATURAL INNER JOIN User " \
                "WHERE ActivityLog.logcreation = %s;"
        cursor.execute(query, (date,))
        result = []
        for row in cursor:
            result.append(row)
        return result


    def insert(self, uID, date, logmessage):
        # Insert new activity log
        cursor = self.conn.cursor()
        query = " INSERT INTO ActivityLog(uid, logcreation, logmessage) " \
                "VALUES (%s, %s, %s);"
        cursor.execute(query, (uID, date,logmessage,))
        logID = cursor.fetchone()[0]
        self.conn.commit()
        return logID