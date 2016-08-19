/**
 * Created by tannguyen on 19/08/2016.
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
            type: Sequelize.STRING(255),
            allowNull: true,
            validate: {
                len: {
                    args: [0, 255],
                    msg: 'Too long!'
                }
            }
        },

        TrackingName: {
            type: Sequelize.STRING(255),
            allowNull: true,
            validate: {
                len: {
                    args: [0, 255],
                    msg: 'Too long!'
                }
            }
        },

        Content: {
            type: Sequelize.TEXT,
            allowNull: true,
            validate: {
                len: {
                    args: [0, 2048],
                    msg: 'Too long!'
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

    },
    associations: function() {},
    options: {
        tableName: 'PushTracking',
        timestamps: false,
        hooks: {}
    }
};
