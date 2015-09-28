module.exports.connections = {
    disk: {
        module: 'sails-disk'
    },
    mysql: {
        module: 'sails-mysql',
        host: '192.168.1.2',
        port: 3306,
        user: 'meditek_db',
        password: 'meditekdb123456',
        database: 'Redimed',
        charset: 'utf8',
        collation: 'utf8-general_ci'
    }
};
