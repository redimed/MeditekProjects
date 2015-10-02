var bcrypt = require('bcrypt');
module.exports = {
    attributes: {
        ID: {
            type: Sequelize.BIGINT(20),
            autoIncrement: true,
            allowNull: false,
            primaryKey: true
        },
        UID: {
            type: Sequelize.STRING(255),
            allowNull: false
        },
        UserName: {
            type: Sequelize.STRING(50),
            allowNull: true,
            validate:{
                len:[0,50]
            }
        },
        Email: {
            type: Sequelize.STRING(250),
            allowNull: true,
            validate:{
                len:[0,255],
                isEmail: true
            }
        },
        PhoneNumber: {
            type: Sequelize.STRING(20),
            allowNull: true,
            validate:{
                len:[0,20]
            }
        },
        Password: {
            type: Sequelize.STRING(256),
            allowNull: false
        },
        PasswordSalt: {
            type: Sequelize.STRING(256),
            allowNull: true
        },
        PasswordHashAlgorithm: {
            type: Sequelize.STRING(256),
            allowNull: true
        },
        Activated: {
            type: Sequelize.STRING(1),
            allowNull: true,
            validate:{
                len:[0,1]
            }
        },
        Enable: {
            type: Sequelize.STRING(1),
            allowNull: true,
            validate:{
                len:[0,1]
            }
        },
        UserType: {
            type: Sequelize.STRING(3),
            allowNull: true,
            validate:{
                len:[0,3]
            }
        },
        Token: {
            type: Sequelize.STRING(256),
            allowNull: true
        },
        TokenExpired: {
            type: Sequelize.DATE,
            allowNull: true
        },
        CreationDate: {
            type: Sequelize.DATE,
            allowNull: true
        },
        CreatedBy: {
            type: Sequelize.BIGINT(20),
            allowNull: true
        },
        ModifiedDate: {
            type: Sequelize.DATE,
            allowNull: true
        },
        ModifiedBy: {
            type: Sequelize.BIGINT(20),
            allowNull: true
        }
    },
    associations: function() {},
    options: {
        tableName: 'UserAccount',
        timestamps: false,
        hooks:{
            beforeCreate: function(user, options, cb) {
                bcrypt.genSalt(10, function(err, salt) {
                    bcrypt.hash(user.Password, salt, function(err, hash) {
                        if (err) {
                            console.log(err);
                            cb(err);
                        } else {
                            user.Password = hash;
                            cb();
                        }
                    });
                });
            }
        }
    },
    
    
};
