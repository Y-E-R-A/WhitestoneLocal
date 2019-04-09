from configs.dbconfig import pg_config

import psycopg2



class CredentialDAO:

    def __init__(self):

        connection_url = "dbname=%s user=%s password=%s" % (pg_config['dbname'],
                                                            pg_config['user'],
                                                            pg_config['passwd'])
        self.conn = psycopg2._connect(connection_url)


    def getAllCredentials(self):
        # Search the email, and pin of all users registered
        cursor = self.conn.cursor()
        query = "SELECT email, pin FROM Credential;"
        cursor.execute(query)
        result = []
        for row in cursor:
            result.append(row)
        return result


    def getCredentialByEmail(self, email):
        # Search all credential information (cID, email, pin) of a user with certain email
        cursor = self.conn.cursor()
        query = "SELECT * FROM Credential WHERE email = %s;"
        cursor.execute(query, (email,))
        result = []
        for row in cursor:
            result.append(row)
        return result


    def insert(self, email, pin):
        # Insert new user's credentials
        cursor = self.conn.cursor()
        query = " INSERT INTO Credential(email, pin) " \
                "VALUES (%s, %s) returning cID;"
        cursor.execute(query, (email, pin,))
        cID = cursor.fetchone()[0]
        self.conn.commit()
        return cID


    def update(self, email, pin, cID):
        # Update email and pin which belongs to a user with certain cID
        cursor = self.conn.cursor()
        query = "UPDATE Credential " \
                "SET email= %s, pin = %s " \
                "WHERE cID = %s;"
        cursor.execute(query, (email, pin, cID,))
        self.conn.commit()
        return cID

    # def updateAllPins(self):
    #     # Update all users pins with a random 4 digits number.
    #     cursor = self.conn.cursor()
    #     query = "UPDATE Credential " \
    #             "SET pin = floor(random()*9999); "
    #     cursor.execute(query)
    #     self.conn.commit()
    #     return
