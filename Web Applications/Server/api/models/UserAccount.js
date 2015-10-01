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
            allowNull: false
        },
        Email: {
            type: Sequelize.STRING(250),
            allowNull: false
        },
        PhoneNumber: {
            type: Sequelize.STRING(20),
            allowNull: false
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
            allowNull: true
        },
        Enable: {
            type: Sequelize.STRING(1),
            allowNull: true
        },
        UserType: {
            type: Sequelize.STRING(3),
            allowNull: true
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
