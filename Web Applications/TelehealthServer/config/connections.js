module.exports.connections = {
  localDiskDb: {
    adapter: 'sails-disk'
  },

  // mysql: {
  //     dialect: 'mysql',
  //     host: '192.168.1.2',
  //     port: 3306,
  //     user: 'meditek_db',
  //     password: 'meditekdb123456',
  //     database: 'Redimed',
  //     charset: 'utf8',
  //     collation: 'utf8-general_ci'
  // },

  mysql: {
      dialect: 'mysql',
      host: 'localhost',
      port: 3306,
      user: 'root',
      password: 'root',
      database: 'Redimed',
      charset: 'utf8',
      collation: 'utf8-general_ci'
  }

};
