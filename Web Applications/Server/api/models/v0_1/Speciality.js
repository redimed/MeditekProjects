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
        Name: {
            type: Sequelize.STRING(255),
            allowNull: true,
            validate: {
                len: {
                    args: [0, 255],
                    msg: 'Too long!'
                }
            }
        },
        // CreatedDate: {
        //     type: Sequelize.DATE,
        //     allowNull: true,
        //     validate: {
        //         isDate: {
        //             msg: 'Invalid!'
        //         }
        //     }
        // },
        // CreatedBy: {
        //     type: Sequelize.BIGINT(20),
        //     allowNull: true,
        //     validate: {
        //         isInt: {
        //             msg: 'Must be an integer!'
        //         }
        //     }
        // },
        // ModifiedDate: {
        //     type: Sequelize.DATE,
        //     allowNull: true,
        //     validate: {
        //         isDate: {
        //             msg: 'Invalid!'
        //         }
        //     }
        // },
        // ModifiedBy: {
        //     type: Sequelize.BIGINT(20),
        //     allowNull: true,
        //     validate: {
        //         isInt: {
        //             msg: 'Must be an integer!'
        //         }
        //     }
        // }
    },
    associations: function() {},
    options: {
        tableName: 'Speciality',
        timestamps: false,
        // hooks: {
        //     beforeCreate: function(role, options, callback) {
        //         role.CreatedDate = new Date();
        //         callback();
        //     },
        //     beforeBulkCreate: function(roles, options, callback) {
        //         roles.forEach(function(role, index) {
        //             roles[index].CreatedDate = new Date();
        //         });
        //         callback();
        //     },
        //     beforeBulkUpdate: function(role, callback) {
        //         role.fields.push('ModifiedDate');
        //         role.attributes.ModifiedDate = new Date();
        //         callback();
        //     }
        // }
    }
};
