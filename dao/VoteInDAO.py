from configs.dbconfig import pg_config
import psycopg2



class VoteInDAO:

    def __init__(self):

        connection_url = "dbname=%s user=%s password=%s" % (pg_config['dbname'],
                                                            pg_config['user'],
                                                            pg_config['passwd'])
        self.conn = psycopg2._connect(connection_url)

    def getVotingParticipants(self, vID):
        cursor = self.conn.cursor()
        query = "SELECT uID, ufirstname, ulastname, email " \
                "FROM VoteIn natural inner join Users natural inner join Credential " \
                "WHERE VoteIn.vID = %s;"
        cursor.execute(query, (vID,))
        self.conn.commit()


    def insert(self, uid, vid):
        #Insert the uid of the person who is permitted to vote in a voting with  a specific vID
        cursor = self.conn.cursor()
        query = "INSERT INTO VoteIn(uid, vid) " \
                "VALUES (%s, %s);"
        cursor.execute(query, (uid, vid,))
        self.conn.commit()
