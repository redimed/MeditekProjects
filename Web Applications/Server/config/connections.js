module.exports.connections = {
    disk: {
        module: 'sails-disk'
    },
    mysql: {
        adapter: 'sails-mysql',
        port: 3306,
        user: 'meditek_db',
        password: 'meditekdb123456',
        // password: 'tz!@9\8$3a?=G].T',
        database: 'Redimed',
        charset: 'utf8',
        collation: 'utf8-general_ci',
        options: {
            host: '192.168.1.2'
        }
    },
};