/**
 * Created by tannguyen on 01/07/2016.
 */
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

        ExternalName: {
            type: Sequelize.STRING(20),
            allowNull: false,
            comment: 'EFORM/...',
            validate: {
                len: {
                    args: [0, 20],
                    msg: 'Too long!'
                }
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
            type: Sequelize.STRING(255),
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

        TokenExpired: {
            type: Sequelize.INTEGER(11),
            allowNull: true,
            validate: {
                isInt: {
                    msg: 'Must be an integer!'
                }
            }
        },
    },
    associations: function () {},
    options: {
        tableName: 'ExternalToken',
        timestamps: false,
        hooks: {
            
        }
    }
}