from configs.dbconfig import pg_config
import psycopg2

class AudioDAO:

    def __init__(self):
        # Database connection
        connection_url = "dbname=%s user=%s password=%s" % (pg_config['dbname'],
                                                            pg_config['user'],
                                                            pg_config['passwd'])
        self.conn = psycopg2._connect(connection_url)


    def getAudioByaID(self, aID):
        # Get an audio specified by aID
        cursor = self.conn.cursor()
        query = "SELECT * " \
                "FROM Audio " \
                "WHERE Audio.aID= %s;"
        cursor.execute(query, (aID,))
        result = cursor.fetchone()
        return result



    def getAudioBymID(self, mID):
        # Get all the audio that belong to a meeting specified by mID
        cursor = self.conn.cursor()
        query = "SELECT * " \
                "FROM Audio " \
                "WHERE Audio.mID= %s;"
        cursor.execute(query, (mID,))
        result = []
        for row in cursor:
            result.append(row)
        return result


    def getAudioByAddress(self, address):
        # Get the audio specified by an address
        cursor = self.conn.cursor()
        query = "SELECT * " \
                "FROM Audio " \
                "WHERE Audio.aaddress= %s;"
        cursor.execute(query, (address,))
        result = cursor.fetchone()
        return result


    def insert(self, mid, aname, aaddress, atype):
        # Insert a new audio file information
        cursor= self.conn.cursor()
        query = "INSERT INTO Audio(mid, aname, aaddress, atype) " \
                "VALUES(%s, %s, %s, %s) RETURNING aID"
        cursor.execute(query, (mid, aname, aaddress, atype,))
        aID= cursor.fetchone()[0]
        self.conn.commit()
        return aID

