from configs.dbconfig import pg_config
import psycopg2



class ParticipatesInDAO:

    def __init__(self):

        connection_url = "dbname=%s user=%s password=%s" % (pg_config['dbname'],
                                                            pg_config['user'],
                                                            pg_config['passwd'])
        self.conn = psycopg2._connect(connection_url)


    def insert(self, uid,  mid):
        #Insert the uid of the person who logged into a meeting with the specified mid
        cursor = self.conn.cursor()
        query = "INSERT INTO ParticipatesIn(uid, mid) " \
                "VALUES (%s, %s);"
        cursor.execute(query, (uid, mid,))
        self.conn.commit()

    def getMeetingParticipants(self, mID):
        cursor = self.conn.cursor()
        query = "SELECT uID, ufirstname, ulastname, email " \
                "FROM ParticipatesIn natural inner join Users natural inner join Credential " \
                "WHERE ParticipatesIn.mID = %s;"
        cursor.execute(query, (mID,))
        result = []
        for row in cursor:
            result.append(row)
        return result


