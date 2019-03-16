from configs.dbconfig import pg_config
import psycopg2



class UsersDAO:

    def __init__(self):



        connection_url = "dbname=%s user=%s password=%s" % (pg_config['dbname'],

                                                            pg_config['user'],

                                                            pg_config['passwd'])

        self.conn = psycopg2._connect(connection_url)

    def getAllUserNames(self):
        # Return a list of all registered users.
        cursor = self.conn.cursor()
        query = "SELECT ufirstname, ulastname" \
                "FROM Users;"
        cursor.execute(query)
        result = []
        for row in cursor:
            result.append(row)

        return result


    def getUserbyEmail(self, email):
        # Return the user information corresponding to an email.
        cursor = self.conn.cursor()
        query = "SELECT ufirstname, ulastname, udescription, urole, uclassification, email, localpassword " \
                "FROM Users natural inner join Credential" \
                "WHERE email= %s;"
        cursor.execute(query, (email,))
        result = cursor.fetchone()
        return result


    def getUserByFullName(self, ufirstname, ulastname):
        # Return a list of all registered users with an specific name and lastname.
        cursor = self.conn.cursor()
        query= "SELECT ufirstname, ulastname, udescription, urole, uclassification, email, localpassword " \
               "FROM Users natural inner join Credential" \
               "WHERE ufirstname= %s and ulastname= %s;"
        cursor.execute(query, (ufirstname, ulastname,))
        result = []
        for row in cursor:
            result.append(row)

        return result



    def insert(self,credentialID, ufisrtname, ulastname, udescription, urole, uclassification):
        # Insert a new User and return its uID
        cursor = self.conn.cursor()
        query= "INSERT into Users(id, ufirstname, ulastname, udescription, urole, uclassification) " \
               "values(%s, %s, %s, %s, %s, %s);"
        cursor.execute(query, (credentialID, ufisrtname, ulastname, udescription, urole, uclassification,))
        uID = cursor.fetchone()[0]
        self.conn.commit()
        return uID


    def update(self, uID, ufirstname, ulastname, udescription, urole, uclassification):
        # Update user information using the uid
        cursor = self.conn.cursor()
        query= "UPDATE Users"\
               "SET ufirstname= %s, ulastname= %s, udescription= %s, urole= %s, uclassification= %s"\
               "WHERE uID= %s; "
        cursor.execute(query,(ufirstname, ulastname, udescription, urole, uclassification,uID,))
        self.conn.commit()
        return uID
