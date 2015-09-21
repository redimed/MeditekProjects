module.exports.connections = {
    disk: {
        module: 'sails-disk'
    },
    mysql: {
        module: 'sails-mysql',
        host: 'localhost',
        port: 3306,
        user: 'root',
        password: 'root',
        database: 'sakila',
        charset: 'utf8',
        collation: 'utf8-general_ci'
    }
};
