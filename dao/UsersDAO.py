from configs.dbconfig import pg_config
import psycopg2

class UsersDAO:

    def __init__(self):

        connection_url = "dbname=%s user=%s password=%s" % (pg_config['dbname'],
                                                            pg_config['user'],
                                                            pg_config['passwd'])
        self.conn = psycopg2._connect(connection_url)



    def getUserbyEmail(self, email):
        # Return the user information corresponding to an email.
        cursor = self.conn.cursor()
        query = "SELECT uid, cid, ufirstname, ulastname, udescription, urole, uclassification, email, pin " \
                "FROM Users natural inner join Credential " \
                "WHERE email= %s;"
        cursor.execute(query, (email,))
        result = cursor.fetchone()
        return result

    def getUserByuID(self, uID):
        # Return the user information corresponding to a uID.
        cursor = self.conn.cursor()
        query = "SELECT ufirstname, ulastname, udescription, urole, uclassification, email, pin " \
                "FROM Users natural inner join Credential " \
                "WHERE uID= %s;"
        cursor.execute(query, (uID,))
        result = cursor.fetchone()
        return result


    def getAllUsersInfo(self):
        # Return a list of all registered users.
        cursor = self.conn.cursor()
        query= "SELECT uid, cid, ufirstname, ulastname, udescription, urole, uclassification, email, pin " \
               "FROM Users natural inner join Credential"
        cursor.execute(query)
        result = []
        for row in cursor:
            result.append(row)

        return result

    def getAllSenators(self):
        # Return all users with urole= senators including the chancellor (senator too)

        cursor = self.conn.cursor()
        query = "SELECT uid " \
                "FROM Users " \
                "WHERE urole= 'Senator' " \
                "OR urole= 'Chancellor'; "
        cursor.execute(query)
        result = []
        for row in cursor:
            result.append(row)

        return result

    def getAllElectSenators(self):
        # Return all users that have are classified as elect senators

        cursor = self.conn.cursor()
        query = "SELECT uid " \
                "FROM Users " \
                "WHERE uclassification= 'Elect Senator';"

        cursor.execute(query)
        result = []
        for row in cursor:
            result.append(row)

        return result

    def getAllElectStudentSenators(self):
        # Return all users that are classified as elect student senators
        cursor = self.conn.cursor()
        query = "SELECT uid " \
                "FROM Users " \
                "WHERE uclassification= 'Elect Student Senator';"

        cursor.execute(query)
        result = []
        for row in cursor:
            result.append(row)

        return result

    def getAllExOfficioSenators(self):
        # Return all users that are classified as Ex-Officio senators
        cursor = self.conn.cursor()
        query = "SELECT uid " \
                "FROM Users " \
                "WHERE uclassification= 'Ex-Officio Senator';"

        cursor.execute(query)
        result = []
        for row in cursor:
            result.append(row)

        return result

    def getAllExOfficioStudentSenators(self):
        # Return all users that are classified as Ex-Officio student senators
        cursor = self.conn.cursor()
        query = "SELECT uid " \
                "FROM Users " \
                "WHERE uclassification= 'Ex-Officio Student Senator';"

        cursor.execute(query)
        result = []
        for row in cursor:
            result.append(row)

        return result


    def insert(self,credentialID, ufirstname, ulastname, udescription, urole, uclassification):
        # Insert a new User and return its uID
        cursor = self.conn.cursor()
        query= "INSERT into Users(cid, ufirstname, ulastname, udescription, urole, uclassification) " \
               "values(%s, %s, %s, %s, %s, %s) RETURNING uID;"
        cursor.execute(query, (credentialID, ufirstname, ulastname, udescription, urole, uclassification,))
        uID = cursor.fetchone()[0]
        self.conn.commit()
        return uID


    def updateUser(self, uID, ufirstname, ulastname, udescription, urole, uclassification):
        # Update user information using the uid
        cursor = self.conn.cursor()
        query= "UPDATE Users "\
               "SET ufirstname= %s, ulastname= %s, udescription= %s, urole= %s, uclassification= %s "\
               "WHERE uID= %s; "
        cursor.execute(query,(ufirstname, ulastname, udescription, urole, uclassification,uID,))
        self.conn.commit()
        return uID


    def deleteUser(self, uID):
        # Delete a user object and its credentials
        cursor = self.conn.cursor()
        query = "DELETE FROM Users CASCADE " \
                "WHERE uID= %s RETURNING cID; "
        cursor.execute(query, (uID,))
        cID = cursor.fetchone()[0]

        query = "DELETE FROM Credential " \
                "WHERE cID= %s; "
        cursor.execute(query, (cID,))

        self.conn.commit()
        return
