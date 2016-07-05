var connections = {
    disk: {
        module: 'sails-disk'
    }
};
if (process.argv.indexOf("--dblocal") >= 0) {
    console.log("||||||||||||||||||||||||| DATABASE LOCAL");
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
    console.log("|||||||||||||||||||||||||| DATABASE MEDITEK");
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
