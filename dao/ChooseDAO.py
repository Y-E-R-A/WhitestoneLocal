from configs.dbconfig import pg_config
import psycopg2



class ChooseDAO:

    def __init__(self):

        connection_url = "dbname=%s user=%s password=%s" % (pg_config['dbname'],
                                                            pg_config['user'],
                                                            pg_config['passwd'])
        self.conn = psycopg2._connect(connection_url)


    def insert(self, uid, altid):
        #Insert the uid of the person who selected a voting alternative with altid
        cursor = self.conn.cursor()
        query = "INSERT INTO Choose(uid, altid)" \
                "VALUES (%s, %s);"
        cursor.execute(query, (uid, altid,))
        self.conn.commit()



