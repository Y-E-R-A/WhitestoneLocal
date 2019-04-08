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
        query = "SELECT email, localpassword FROM Credential;"
        cursor.execute(query)
        result = []
        for row in cursor:
            result.append(row)
        return result


    def getCredentialByEmail(self, email):
        # Search all credential information (ID, email, pin) of a user with certain email
        cursor = self.conn.cursor()
        query = "SELECT * FROM Credential WHERE email = %s;"
        cursor.execute(query, (email,))
        result = []
        for row in cursor:
            result.append(row)
        return result


    def insert(self, email, localpassword):
        # Insert new user's credentials
        cursor = self.conn.cursor()
        query = " INSERT INTO Credential(email, localpassword) " \
                "VALUES (%s, %s) returning ID;"
        cursor.execute(query, (email, localpassword,))
        cID = cursor.fetchone()[0]
        self.conn.commit()
        return cID


    def update(self, email, localpassword, ID):
        # Update email and pin which belongs to a user with certain ID
        cursor = self.conn.cursor()
        query = "UPDATE Credential " \
                "SET email= %s, localpassword = %s " \
                "WHERE ID = %s;"
        cursor.execute(query, (email, localpassword, ID,))
        self.conn.commit()
        return ID

    # def updateAllPins(self):
    #     # Update all users pins with a random 4 digits number.
    #     cursor = self.conn.cursor()
    #     query = "UPDATE Credential " \
    #             "SET localpassword = floor(random()*9999); "
    #     cursor.execute(query)
    #     self.conn.commit()
    #     return
