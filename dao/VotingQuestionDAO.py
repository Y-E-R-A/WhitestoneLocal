from configs.dbconfig import pq_config
import psycopg2

class VotingQuestionDAO:

    def __init__(self):
        connection_url = "dbname=%s user=%s password=%s" % (pg_config['dbname'],

                                                            pg_config['user'],

                                                            pg_config['passwd'])

        self.conn = psycopg2._connect(connection_url)



    def getVotingQuestionByID(self, vID):
        # Return the voting question with the corresponding vID
        cursor = self.conn.cursor()
        query = "SELECT vquestion" \
                "FROM VotingQuestion" \
                "WHERE vID = %s;"
        cursor.execute(query, (vID,))
        result = cursor.fetchone()
        return result


    def getVotingResults(self, vID):
        # Return the alternatives and their votes obtained
        cursor = self.conn.cursor()
        query = "SELECT choice, COUNT(*)" \
                "FROM(SELECT * FROM VotingChoice NATURAL INNER JOIN Choose) AS Results " \
                "NATURAL INNER JOIN VotingQuestion" \
                "WHERE VotingQuestion.vID= %s" \
                "GROUP BY choice " \
                "ORDER BY choice DESC;"
        cursor.execute(query, (vID,))
        result = []
        for row in cursor:
            result.append(row)
        return result


    def insert(self, creatorID, mID, vdescription, vdate, vtime, vquestion, selectionlimit, vstatus):
        # Insert new voting question and return its vID
        cursor = self.conn.cursor()
        query = "INSERT INTO VotingQuestion(creatorID, mid, vdate, vtime, vdescription, vquestion, selectionlimit, vstatus)" \
                "VALUES (%s, %s, %s, %s, %s, %s, %s, %s);"
        cursor.execute(query, (creatorID, mID, vdescription, vdate, vtime, vquestion, selectionlimit, vstatus,))
        vID= cursor.fetchone()[0]
        self.conn.commit()
        return vID

