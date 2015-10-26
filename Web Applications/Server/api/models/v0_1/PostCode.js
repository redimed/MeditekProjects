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
        Postcode: {
            type: Sequelize.STRING(10),
            allowNull: false,
            validate: {
                len: {
                    args: [0, 10],
                    msg: 'Too long!'
                }
            }
        },
        Suburb: {
            type: Sequelize.STRING(45),
            allowNull: false,
            validate: {
                len: {
                    args: [0, 45],
                    msg: 'Too long!'
                }
            }
        },
        State: {
            type: Sequelize.STRING(4),
            allowNull: false,
            validate: {
                len: {
                    args: [0, 4],
                    msg: 'Too long!'
                }
            }
        },
        DC: {
            type: Sequelize.STRING(45),
            allowNull: false,
            validate: {
                len: {
                    args: [0, 45],
                    msg: 'Too long!'
                }
            }
        },
        Type: {
            type: Sequelize.STRING(45),
            allowNull: false,
            validate: {
                len: {
                    args: [0, 45],
                    msg: 'Too long!'
                }
            }
        },
        Lat: {
            type: Sequelize.DOUBLE,
            allowNull: false,
            validate: {
                isDecimal: {
                    msg: 'Must be a number!'
                }
            }
        },
        Lon: {
            type: Sequelize.DOUBLE,
            allowNull: false,
            validate: {
                isDecimal: {
                    msg: 'Must be a number!'
                }
            }
        }
    },
    associations: function() {},
    options: {
        tableName: 'PostCode',
        timestamps: false,
        hooks: {}
    }
};
