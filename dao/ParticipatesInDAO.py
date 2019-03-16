from configs.dbconfig import pg_config
import psycopg2



class ParticipatesInDAO:

    def __init__(self):

        connection_url = "dbname=%s user=%s password=%s" % (pg_config['dbname'],
                                                            pg_config['user'],
                                                            pg_config['passwd'])
        self.conn = psycopg2._connect(connection_url)


    def insert(self, uid,  mid):
        #Insert the uid of the person who logged into a meeting with the specified mid
        cursor = self.conn.cursor()
        query = "INSERT INTO VoteIn(uid, mid)" \
                "VALUES (%s, %s);"
        cursor.execute(query, (uid, mid,))
        self.conn.commit()
