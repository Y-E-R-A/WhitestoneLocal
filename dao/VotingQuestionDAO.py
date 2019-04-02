from configs.dbconfig import pg_config
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
        query = "SELECT * " \
                "FROM VotingQuestion " \
                "WHERE vID = %s;"
        cursor.execute(query, (vID,))
        result = cursor.fetchone()
        return result

    def getInactiveVotingQuestionBymID(self, mID):
        # Return the voting question corresponding to a specific meeting ID
        cursor = self.conn.cursor()
        query = "SELECT vID, vquestion, altID, choice, count(*), vtime, vdate " \
                "FROM (VotingChoice NATURAL INNER JOIN Choose AS Result) NATURAL INNER JOIN VotingQuestion " \
                "WHERE mID = 2 AND vstatus = 'Inactive' " \
                "GROUP BY altID, vID, vquestion, choice, vtime, vdate " \
                "ORDER BY vID, vtime, choice DESC"

        cursor.execute(query, (mID,))
        result = []
        for row in cursor:
            result.append(row)
        return result

    def getActiveVotingQuestionBymID(self, mID):
        # Return the voting question corresponding to a specific meeting ID
        cursor = self.conn.cursor()
        query = "SELECT * " \
                "FROM VotingQuestion NATURAL INNER JOIN VotingChoice " \
                "WHERE mID = %s " \
                "and vstatus= 'Active';"
        cursor.execute(query, (mID,))
        result = []
        for row in cursor:
            result.append(row)
        return result


    def getVotingResultsByvID(self, vID):
        # Return the alternatives and their votes obtained
        cursor = self.conn.cursor()
        query = "SELECT choice, COUNT(*) " \
                "FROM(SELECT * FROM VotingChoice NATURAL INNER JOIN Choose) AS Results " \
                "NATURAL INNER JOIN VotingQuestion " \
                "WHERE VotingQuestion.vID= %s " \
                "and vstatus = 'Inactive' " \
                "GROUP BY choice " \
                "ORDER BY choice DESC;"

        cursor.execute(query, (vID,))
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


    def insert(self, creatorID, mID, vdescription, vdate, vtime, vquestion, selectionlimit, vstatus):
        # Insert new voting question and return its vID
        cursor = self.conn.cursor()
        query = "INSERT INTO VotingQuestion(creatorID, mid, vdate, vtime, vdescription, vquestion, selectionlimit, vstatus) " \
                "VALUES (%s, %s, %s, %s, %s, %s, %s, %s) RETURNING vID;"
        cursor.execute(query, (creatorID, mID, vdate, vtime,vdescription, vquestion, selectionlimit, vstatus,))
        vID= cursor.fetchone()[0]
        self.conn.commit()
        return vID

