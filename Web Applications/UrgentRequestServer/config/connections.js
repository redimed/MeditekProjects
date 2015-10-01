module.exports.connections = {
    disk: {
        module: 'sails-disk'
    },
    mysql: {
        /*
        test local
        */
        // module: 'sails-mysql',
        // host: 'localhost',
        // port: 3306,
        // user: 'root',
        // password: 'root',
        // database: 'sakila',
        // charset: 'utf8',
        // collation: 'utf8-general_ci'

        /*
        test app
        */
        module: 'sails-mysql',
        host: 'localhost',
        port: 3306,
        user: 'meditek_db',
        password: 'meditekdb123456',
        database: 'Redimed',
        charset: 'utf8',
        collation: 'utf8-general_ci'
    }
};
