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

        SystemType: {
            type: Sequelize.STRING(45),
            allowNull: true,
            comment: 'IOS: IOS\nWebsite: WEB\nAndroid: ARD',
            validate: {
                len: {
                    args: [0, 45],
                    msg: 'Too long!'
                }
            }
        },

        DeviceID: {
            type: Sequelize.STRING(255),
            allowNull: true,
            validate: {
                len: {
                    args: [0, 255],
                    msg: 'Too long!'
                }
            }
        },

        AppID: {
            type: Sequelize.STRING(45),
            allowNull: true,
            validate: {
                len: {
                    args: [0, 255],
                    msg: 'Too long!'
                }
            }
        },

        OldCode: {
            type: Sequelize.STRING(255),
            allowNull: true,
            validate: {
                len: {
                    args: [0, 255],
                    msg: 'Too long!'
                }
            }
        },

        OldCodeExpiredAt: {
            type: Sequelize.DATE,
            allowNull: true,
            validate: {
                isDate: {
                    msg: 'Invalid!'
                }
            }
        },

        RefreshCode: {
            type: Sequelize.STRING(255),
            allowNull: true,
            validate: {
                len: {
                    args: [0, 255],
                    msg: 'Too long!'
                }
            }
        },

        Status: {
            type: Sequelize.STRING(45),
            allowNull: true,
            validate: {
                len: {
                    args: [0, 255],
                    msg: 'Too long!'
                }
            }
        },

        SecretKey: {
            type: Sequelize.STRING(255),
            allowNull: true,
            validate: {
                len: {
                    args: [0, 255],
                    msg: 'Too long!'
                }
            }
        },

        SecretCreatedAt: {
            type: Sequelize.DATE,
            allowNull: true,
            validate: {
                isDate: {
                    msg: 'Invalid!'
                }
            }
        },

        SecretExpired: {
            type: Sequelize.INTEGER(11),
            allowNull: true,
            validate: {

                isInt: {
                    msg: 'Must be an integer!'
                }
            }
        },

        SecretExpiredPlus: {
            type: Sequelize.INTEGER(11),
            allowNull: true,
            validate: {

                isInt: {
                    msg: 'Must be an integer!'
                }
            }
        },

    },
    associations: function() {},
    options: {
        tableName: 'RefreshToken',
        timestamps: false,
        hooks: {}
    }
};
