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
        TelehealthAppointmentID: {
            type: Sequelize.BIGINT(20),
            allowNull: true,
            validate: {
                isInt: {
                    msg: 'Must be an integer!'
                }
            },
            references: {
                model: 'TelehealthAppointment',
                key: 'ID'
            }
        },
        Speciality: {
            type: Sequelize.STRING(100),
            allowNull: true,
            comment: 'Plastic Sergery\nOrthopaedic Surgery',
            validate: {
                len: {
                    args: [0, 100],
                    msg: 'Too long!'
                }
            }
        },
        Name: {
            type: Sequelize.STRING(255),
            allowNull: true,
            comment: 'Name of Specialist',
            validate: {
                len: {
                    args: [0, 255],
                    msg: 'Too long!'
                }
            }
        },
        SiteName: {
            type: Sequelize.STRING(255),
            allowNull: true,
            comment: 'List of values',
            validate: {
                len: {
                    args: [0, 255],
                    msg: 'Too long!'
                }
            }
        }
    },
    associations: function() {},
    options: {
        tableName: 'PreferredPractitioner',
        timestamps: false,
        hooks: {}
    }
};
