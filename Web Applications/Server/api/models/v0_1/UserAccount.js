var bcrypt = require('bcrypt-nodejs');
module.exports = {
    attributes: {
        ID: {
            type: Sequelize.BIGINT(20),
            autoIncrement: true,
            allowNull: false,
            validate: {
                isInt: {
                    msg: 'Must be an integer!'
                }
            },
            primaryKey: true
        },
        UID: {
            type: Sequelize.STRING(255),
            allowNull: false,
            validate: {
                isUUID: {
                    args: 4,
                    msg: 'Must be an UUID V4!'
                }
            }
        },
        UserName: {
            type: Sequelize.STRING(50),
            allowNull: true,
            validate: {
                len: {
                    args: [0, 50],
                    msg: 'Too long!'
                }
            }
        },
        Email: {
            type: Sequelize.STRING(255),
            allowNull: true,
            validate: {
                isEmail: {
                    msg: 'Invalid!'
                },
                len: {
                    args: [0, 255],
                    msg: 'Too long!'
                }
            }
        },
        PhoneNumber: {
            type: Sequelize.STRING(20),
            allowNull: true,
            validate: {
                len: {
                    args: [0, 20],
                    msg: 'Too long!'
                }
            }
        },
        Password: {
            type: Sequelize.STRING(255),
            allowNull: false,
            validate: {
                len: {
                    args: [0, 255],
                    msg: 'Too long!'
                }
            }
        },
        PasswordSalt: {
            type: Sequelize.STRING(255),
            allowNull: true,
            validate: {
                len: {
                    args: [0, 255],
                    msg: 'Too long!'
                }
            }
        },
        PasswordHashAlgorithm: {
            type: Sequelize.STRING(255),
            allowNull: true,
            validate: {
                len: {
                    args: [0, 255],
                    msg: 'Too long!'
                }
            }
        },
        Activated: {
            type: Sequelize.STRING(1),
            allowNull: true,
            validate: {
                len: {
                    args: [0, 1],
                    msg: 'Too long!'
                }
            }
        },
        Enable: {
            type: Sequelize.STRING(1),
            allowNull: true,
	       defaultValue:'Y',
            validate: {
                len: {
                    args: [0, 1],
                    msg: 'Too long!'
                }
            }
        },
        UserType: {
            type: Sequelize.STRING(3),
            allowNull: true,
            validate: {
                len: {
                    args: [0, 3],
                    msg: 'Too long!'
                }
            }
        },
        Token: {
            type: Sequelize.STRING(255),
            allowNull: true,
            validate: {
                len: {
                    args: [0, 255],
                    msg: 'Too long!'
                }
            }
        },
        TokenExpired: {
            type: Sequelize.DATE,
            allowNull: true,
            validate: {
                isDate: {
                    msg: 'Invalid!'
                }
            }
        },
        CreatedDate: {
            type: Sequelize.DATE,
            allowNull: true,
            validate: {
                isDate: {
                    msg: 'Invalid!'
                }
            }
        },
        CreatedBy: {
            type: Sequelize.BIGINT(20),
            allowNull: true,
            validate: {
                isInt: {
                    msg: 'Must be an integer!'
                }
            }
        },
        ModifiedDate: {
            type: Sequelize.DATE,
            allowNull: true,
            validate: {
                isDate: {
                    msg: 'Invalid!'
                }
            }
        },
        ModifiedBy: {
            type: Sequelize.BIGINT(20),
            allowNull: true,
            validate: {
                isInt: {
                    msg: 'Must be an integer!'
                }
            }
        }
    },
    associations: function() {},
    options: {
        tableName: 'UserAccount',
        timestamps: false,
        hooks: {
            beforeCreate: function(useraccount, options, callback) {
                useraccount.CreatedDate = new Date();
                bcrypt.genSalt(10, function(err, salt) {
                    bcrypt.hash(useraccount.Password, salt, null, function(err, hash) {
                        if (err) {
                            console.log(err);
                            callback(err);
                        } else {
                            useraccount.Password = hash;
                            callback();
                        }
                    });
                });
            },
            beforeBulkCreate: function(useraccounts, options, callback) {
                useraccounts.forEach(function(useraccount, index) {
                    useraccounts[index].CreatedDate = new Date();
                });
                callback();
            },
            beforeBulkUpdate: function(useraccount, callback) {
                useraccount.ModifiedDate = new Date();
                callback();
            }
        }
    }
};
