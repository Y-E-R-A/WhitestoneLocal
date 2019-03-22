from configs.dbconfig import pg_config
import psycopg2

class AudioDAO:

    def __init__(self):
        connection_url = "dbname=%s user=%s password=%s" % (pg_config['dbname'],

                                                            pg_config['user'],

                                                            pg_config['passwd'])

        self.conn = psycopg2._connect(connection_url)




    def getAudioBymID(self, mID):
        #Get all the audio that belong to a meeting specified by mID
        cursor = self.conn.cursor()
        query = "SELECT * " \
                "FROM Audio " \
                "WHERE Audio.mID= %s;"
        cursor.execute(query, (mID,))
        result = []
        for row in cursor:
            result.append(row)
        return result



    def insert(self, uid, mid, aname, aaddress, atype):
        # Insert a new audio file to the Audio table to store its address and info
        cursor= self.conn.cursor()
        query = "INSERT INTO Audio(uid, mid, aname, aaddress, atype) " \
                "VALUES(%s, %s, %s, %s, %s)"
        cursor.execute(query, (uid, mid, aname, aaddress, atype,))
        aID= cursor.fetchone()[0]
        self.conn.commit()
        return aID

