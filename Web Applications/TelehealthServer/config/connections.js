module.exports.connections = {
  localDiskDb: {
    adapter: 'sails-disk'
  },

  mysql: {
      dialect: 'mysql',
      port: 3306,
      // user: 'root',
      user: 'meditek_db',
      // password: 'tz!@9\8$3a?=G].T',
      password: 'meditekdb123456',
      // password: 'root',
      database: 'Redimed',
      charset: 'utf8',
      collation: 'utf8-general_ci',
      options:{
        host:'192.168.1.2'
        // host:'localhost'
      }
  },

  // mysql: {
  //     dialect: 'mysql',
  //     host: 'localhost',
  //     port: 3306,
  //     user: 'root',
  //     password: 'root',
  //     database: 'Redimed',
  //     charset: 'utf8',
  //     collation: 'utf8-general_ci'
  // }

};
