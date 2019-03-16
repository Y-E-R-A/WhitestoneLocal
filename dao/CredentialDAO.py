from configs.dbconfig import pg_config

import psycopg2



class CredentialDAO:

    def __init__(self):

        connection_url = "dbname=%s user=%s password=%s" % (pg_config['dbname'],
                                                            pg_config['user'],
                                                            pg_config['passwd'])
        self.conn = psycopg2._connect(connection_url)




    def getAllCredentials(self):
        cursor = self.conn.cursor()
        query = "SELECT * FROM Credential;"
        cursor.execute(query)
        result = []
        for row in cursor:
            result.append(row)
        return result


    def getCredentialById(self, cid):

        cursor = self.conn.cursor()
        query = "SELECT * from Credential WHERE cid = %s;"
        cursor.execute(query, (cid,))
        result = []
        for row in cursor:
            result.append(row)
        return result


    def insert(self, email, localpassword):
        # Insert new user's credentials
        cursor = self.conn.cursor()
        query = " INSERT INTO Credential(email, localpassword)" \
                "VALUES (%s, %s);"
        cursor.execute(query, (email, localpassword,))
        cID= cursor.fetchone()[0]
        self.conn.commit()
        return cID


    def update(self, email, localpassword, cID):
        # Update email and local password which belongs to cID
        cursor = self.conn.cursor()
        query = "UPDATE Credential" \
                "SET email= %s, localpassword = %s" \
                "WHERE cID = %s;"
        cursor.execute(query, (email, localpassword, cID,))
        self.conn.commit()
        return cID

