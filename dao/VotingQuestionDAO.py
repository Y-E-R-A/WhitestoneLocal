from configs.dbconfig import pg_config
import psycopg2

class VotingQuestionDAO:

    def __init__(self):
        # Database connection
        connection_url = "dbname=%s user=%s password=%s" % (pg_config['dbname'],
                                                            pg_config['user'],
                                                            pg_config['passwd'])

        self.conn = psycopg2._connect(connection_url)



    def getVotingQuestionByID(self, vID):
        # Return the voting question with the corresponding vID
        cursor = self.conn.cursor()
        query = "SELECT * " \
                "FROM VotingQuestion " \
                "WHERE vID = %s;"
        cursor.execute(query, (vID,))
        result = cursor.fetchone()
        return result

    def getInactiveVotingQuestionBymID(self, mID):
        # Return the voting question corresponding to a specific meeting ID
        cursor = self.conn.cursor()
        query = "SELECT * " \
                "FROM VotingQuestion " \
                "WHERE mID = %s AND vstatus = 'Inactive' " \
                "ORDER BY vtime DESC"

        cursor.execute(query, (mID,))
        result = []
        for row in cursor:
            result.append(row)
        return result

    def getActiveVotingQuestionBymID(self, mID):
        # Return the voting question corresponding to a specific meeting ID
        cursor = self.conn.cursor()
        query = "SELECT * " \
                "FROM VotingQuestion " \
                "WHERE mID = %s " \
                "and vstatus= 'Active';"


        cursor.execute(query, (mID,))
        result = []
        for row in cursor:
            result.append(row)
        return result



    def updateVotingStatus(self, vID, vstatus):
        # Modify the voting status (Active or Inactive)
        cursor = self.conn.cursor()
        query = "UPDATE VotingQuestion " \
                "SET vstatus = %s " \
                "WHERE vID = %s"
        cursor.execute(query, (vstatus, vID,))
        self.conn.commit()


    def insertVotingQuestion(self, mID, vinstructions, vdate, vtime, vquestion, selectionlimit, vstatus):
        # Insert new voting question and return its vID
        cursor = self.conn.cursor()
        query = "INSERT INTO VotingQuestion(mid, vdate, vtime, vinstructions, vquestion, selectionlimit, vstatus) " \
                "VALUES (%s, %s, %s, %s, %s, %s, %s) RETURNING vID;"
        cursor.execute(query, (mID, vdate, vtime,vinstructions, vquestion, selectionlimit, vstatus,))
        vID= cursor.fetchone()[0]
        self.conn.commit()
        return vID

