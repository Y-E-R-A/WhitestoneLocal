from configs.dbconfig import pg_config
import psycopg2

class VotingChoiceDAO:

    def __init__(self):
        connection_url = "dbname=%s user=%s password=%s" % (pg_config['dbname'],

                                                            pg_config['user'],

                                                            pg_config['passwd'])

        self.conn = psycopg2._connect(connection_url)


    def getVotingChoiceByVID(self, vID):
        # Return all the alternatives of a voting question with certain vID
        cursor = self.conn.cursor()
        query = "SELECT altid, choice, votes " \
                "FROM VotingQuestion inner join VotingChoice " \
                "ON VotingQuestion.vID = VotingChoice.vID " \
                "WHERE VotingQuestion.vID = %s;"
        cursor.execute(query, (vID,))
        result= []
        for row in cursor:
            result.append(row)
        return result


    def insertVotingChoice(self, vid, choice, votes):
        # Insert a new voting choice or alternative for a voting with an specific vID and return its altID
        cursor = self.conn.cursor()
        query = "INSERT INTO VotingChoice(vid, choice, votes) " \
                "VALUES(%s, %s, %s) RETURNING altID;"
        cursor.execute(query, (vid, choice, votes))
        altID = cursor.fetchone()[0]
        self.conn.commit()
        return altID


