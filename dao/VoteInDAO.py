from configs.dbconfig import pg_config
import psycopg2



class VoteInDAO:

    def __init__(self):

        connection_url = "dbname=%s user=%s password=%s" % (pg_config['dbname'],
                                                            pg_config['user'],
                                                            pg_config['passwd'])
        self.conn = psycopg2._connect(connection_url)




    def getParticipant(self, vID, uID):
        # Check if the user with uID participates in a particular voting
        cursor = self.conn.cursor()
        query = "SELECT vID, uID, exercised_vote  " \
                "FROM VoteIn " \
                "WHERE vid= %s " \
                "AND uid= %s"
        cursor.execute(query, (vID, uID,))
        result = cursor.fetchone()
        return result


    def insertVoteIn(self, uid, vid):
        # Insert the uid of the person who is permitted to vote in a voting with  a specific vID
        cursor = self.conn.cursor()
        query = "INSERT INTO VoteIn(uid, vid, exercised_vote) " \
                "VALUES (%s, %s, %s);"
        cursor.execute(query, (uid, vid, False))
        self.conn.commit()


    def updateVoteInFlag(self, uid, vid):
        # Change the exercise_vote flag to TRUE
        cursor = self.conn.cursor()
        query = "UPDATE VoteIN " \
                "SET exercised_vote = %s " \
                "WHERE uID= %s " \
                "AND vID= %s; "
        cursor.execute(query, (True, uid, vid,))
        self.conn.commit()
        return uid