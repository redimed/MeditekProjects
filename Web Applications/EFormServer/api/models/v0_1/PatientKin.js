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
        FirstName: {
            type: Sequelize.STRING(50),
            allowNull: true,
            validate: {
                len: {
                    args: [0, 50],
                    msg: 'Too long!'
                },
                is: /^[a-zA-Z0-9\s]{0,50}$/
            }
        },
        MiddleName: {
            type: Sequelize.STRING(100),
            allowNull: true,
            validate: {
                len: {
                    args: [0, 100],
                    msg: 'Too long!'
                },
                is: /^[a-zA-Z0-9\s]{0,100}$/
            }
        },
        LastName: {
            type: Sequelize.STRING(255),
            allowNull: true,
            validate: {
                len: {
                    args: [0, 255],
                    msg: 'Too long!'
                },
                is: /^[a-zA-Z0-9\s]{0,50}$/
            }
        },
        Relationship: {
            type: Sequelize.STRING(255),
            allowNull: true,
            validate: {
                len: {
                    args: [0, 255],
                    msg: 'Too long!'
                }
            }
        },
        MobilePhoneNumber: {
            type: Sequelize.STRING(20),
            allowNull: true,
            validate: {
                len: {
                    args: [0, 20],
                    msg: 'Too long!'
                }
            }
        },
        HomePhoneNumber: {
            type: Sequelize.STRING(20),
            allowNull: true,
            validate: {
                len: {
                    args: [0, 20],
                    msg: 'Too long!'
                }
            }
        },
        WorkPhoneNumber: {
            type: Sequelize.STRING(20),
            allowNull: true,
            validate: {
                len: {
                    args: [0, 20],
                    msg: 'Too long!'
                }
            }
        },
        Address1: {
            type: Sequelize.STRING(255),
            allowNull: true,
            validate: {
                len: {
                    args: [0, 255],
                    msg: 'Too long!'
                },
                is: /^[a-zA-Z0-9\s,'-\/]{0,255}$/
            }
        },
        Address2: {
            type: Sequelize.STRING(255),
            allowNull: true,
            validate: {
                len: {
                    args: [0, 255],
                    msg: 'Too long!'
                },
                is: /^[a-zA-Z0-9\s,'-\/]{0,255}$/
            }
        },
        Postcode: {
            type: Sequelize.STRING(10),
            allowNull: true,
            validate: {
                len: {
                    args: [0, 10],
                    msg: 'Too long!'
                },
                is: /^[0-9]{4,10}$/
            }
        },
        Suburb: {
            type: Sequelize.STRING(100),
            allowNull: true,
            validate: {
                len: {
                    args: [0, 100],
                    msg: 'Too long!'
                },
                is: /^[a-zA-Z0-9\s]{0,100}$/
            }
        },
        State: {
            type: Sequelize.STRING(100),
            allowNull: true,
            validate: {
                len: {
                    args: [0, 100],
                    msg: 'Too long!'
                },
                is: /^[a-zA-Z\s]{0,100}$/
            }
        },
        CountryID: {
            type: Sequelize.BIGINT(20),
            allowNull: true,
            validate: {
                isInt: {
                    msg: 'Must be an integer!'
                },
                isNumeric: true
            },
            references: {
                model: 'Country',
                key: 'ID'
            }
        },
    },
    associations: function() {},
    options: {
        tableName: 'PatientKin',
        timestamps: false,
        hooks: {}
    }
};
