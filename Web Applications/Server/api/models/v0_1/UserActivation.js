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
        UserAccountID: {
            type: Sequelize.BIGINT(20),
            allowNull: true,
            validate: {
                isInt: {
                    msg: 'Must be an integer!'
                }
            },
            references: {
                model: 'UserAccount',
                key: 'ID'
            }
        },
        VerificationCode: {
            type: Sequelize.STRING(255),
            allowNull: true,
            validate: {
                len: {
                    args: [0, 255],
                    msg: 'Too long!'
                }
            }
        },
        Type: {
            type: Sequelize.STRING(45),
            allowNull: true,
            comment: 'IOS: IOS; Website: WEB; Android: ARD',
            validate: {
                len: {
                    args: [0, 45],
                    msg: 'Too long!'
                }
            }
        },
        VerificationToken: {
            type: Sequelize.STRING(255),
            allowNull: true,
            validate: {
                len: {
                    args: [0, 255],
                    msg: 'Too long!'
                }
            }
        },
        DeviceID: {
            type: Sequelize.TEXT,
            validate: {

                len: {
                    args: [0, 2048],
                    msg: 'Too long!'
                }
            }
        },
        AppID: {
            type: Sequelize.STRING(255),
            allowNull: true,
            validate: {
                len: {
                    args: [0, 255],
                    msg: 'Too long!'
                }
            }
        },
        TokenCreatedDate: {
            type: Sequelize.DATE,
            allowNull: true,
            validate: {
                isDate: {
                    msg: 'Invalid!'
                }
            }
        },
        TokenExpired: {
            type: Sequelize.INTEGER(11),
            allowNull: true,
            validate: {

                isInt: {
                    msg: 'Must be an integer!'
                }
            }
        },
        CodeExpired: {
            type: Sequelize.INTEGER(11),
            allowNull: true,
            validate: {

                isInt: {
                    msg: 'Must be an integer!'
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
        tableName: 'UserActivation',
        timestamps: false,
        hooks: {
            beforeCreate: function(useractivation, options, callback) {
                useractivation.CreatedDate = new Date();
                callback();
            },
            beforeBulkCreate: function(useractivations, options, callback) {
                useractivations.forEach(function(useractivation, index) {
                    useractivations[index].CreatedDate = new Date();
                });
                callback();
            },
            beforeBulkUpdate: function(useractivation, callback) {
                useractivation.fields.push('ModifiedDate');
                useractivation.attributes.ModifiedDate = new Date();
                callback();
            }
        }
    }
};
