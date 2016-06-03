var connections = {
    /***************************************************************************
     *                                                                          *
     * Local disk storage for DEVELOPMENT ONLY                                  *
     *                                                                          *
     * Installed by default.                                                    *
     *                                                                          *
     ***************************************************************************/
    localDiskDb: {
        adapter: 'sails-disk'
    },
    /***************************************************************************
     *                                                                          *
     * MongoDB is the leading NoSQL database.                                   *
     * http://en.wikipedia.org/wiki/MongoDB                                     *
     *                                                                          *
     * Run: npm install sails-mongo                                             *
     *                                                                          *
     ***************************************************************************/
    someMongodbServer: {
        adapter: 'sails-mongo',
        host: 'localhost',
        port: 27017,
        // user: 'username',
        // password: 'password',
        // database: 'your_mongo_db_name_here'
    },
    /***************************************************************************
     *                                                                          *
     * PostgreSQL is another officially supported relational database.          *
     * http://en.wikipedia.org/wiki/PostgreSQL                                  *
     *                                                                          *
     * Run: npm install sails-postgresql                                        *
     *                                                                          *
     *                                                                          *
     ***************************************************************************/
    somePostgresqlServer: {
        adapter: 'sails-postgresql',
        host: 'YOUR_POSTGRES_SERVER_HOSTNAME_OR_IP_ADDRESS',
        user: 'YOUR_POSTGRES_USER',
        password: 'YOUR_POSTGRES_PASSWORD',
        database: 'YOUR_POSTGRES_DB'
    }
};
if (process.argv.indexOf("--dblocal") >= 0) {
    /***************************************************************************
     *                                                                          *
     * MySQL is the world's most popular relational database.                   *
     * http://en.wikipedia.org/wiki/MySQL                                       *
     *                                                                          *
     * Run: npm install sails-mysql                                             *
     *                                                                          *
     ***************************************************************************/
    console.log("connections", "database local");
    connections.mysql = {
        dialect: 'mysql',
        host: 'localhost',
        port: 3306,
        user: 'root',
        password: 'root',
        database: 'Redimed',
        charset: 'utf8',
        collation: 'utf8-general_ci'
    }
} else {
    /***************************************************************************
     *                                                                          *
     * MySQL is the world's most popular relational database.                   *
     * http://en.wikipedia.org/wiki/MySQL                                       *
     *                                                                          *
     * Run: npm install sails-mysql                                             *
     *                                                                          *
     ***************************************************************************/
    console.log("connections", "database meditek");
    connections.mysql = {
        adapter: 'sails-mysql',
        port: 3306,
        user: 'meditek_db',
        password: 'meditekdb123456',
        database: 'Redimed',
        charset: 'utf8',
        collation: 'utf8-general_ci',
        options: {
            host: '192.168.1.2'
        }
    }
}

module.exports.connections = connections;
