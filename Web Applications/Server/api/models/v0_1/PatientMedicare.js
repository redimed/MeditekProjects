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
        PatientID: {
            type: Sequelize.BIGINT(20),
            allowNull: true,
            validate: {
                isInt: {
                    msg: 'Must be an integer!'
                }
            },
            references: {
                model: 'Patient',
                key: 'ID'
            }
        },
        UID: {
            type: Sequelize.STRING(255),
            allowNull: true,
            validate: {
                isUUID: {
                    args: 4,
                    msg: 'Must be an UUID V4!'
                }
            }
        },
        MedicareNumber: {
            type: Sequelize.STRING(45),
            allowNull: true,
            validate: {
                len: {
                    args: [0, 45],
                    msg: 'Too long!'
                }
            }
        },
        MedicareReferenceNumber: {
            type: Sequelize.STRING(45),
            allowNull: true,
            validate: {
                len: {
                    args: [0, 45],
                    msg: 'Too long!'
                }
            }
        },
        ExpiryDate: {
            type: Sequelize.DATE,
            allowNull: true,
            validate: {
                isDate: {
                    msg: 'Invalid!'
                }
            }
        },
        DVANumber: {
            type: Sequelize.STRING(45),
            allowNull: true,
            validate: {
                len: {
                    args: [0, 45],
                    msg: 'Too long!'
                }
            }
        },
        InjuryType: {
            type: Sequelize.STRING(3),
            allowNull: true,
            comment: 'MVA: Motor vehicle accident\nWIY: Work injury',
            validate: {
                len: {
                    args: [0, 3],
                    msg: 'Too long!'
                }
            }
        }
    },
    associations: function() {},
    options: {
        tableName: 'PatientMedicare',
        timestamps: false,
        hooks: {}
    }
};
