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
        Title: {
            type: Sequelize.STRING(45),
            allowNull: true,
            validate: {
                len: {
                    args: [0, 45],
                    msg: 'Too long!'
                }
            }
        },
        MaritalStatus: {
            type: Sequelize.STRING(100),
            allowNull: true,
            validate: {
                len: {
                    args: [0, 100],
                    msg: 'Too long!'
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
                }
            }
        },
        MiddleName: {
            type: Sequelize.STRING(100),
            allowNull: true,
            validate: {
                len: {
                    args: [0, 100],
                    msg: 'Too long!'
                }
            }
        },
        LastName: {
            type: Sequelize.STRING(255),
            allowNull: true,
            validate: {
                len: {
                    args: [0, 255],
                    msg: 'Too long!'
                }
            }
        },
        PreferredName: {
            type: Sequelize.STRING(255),
            allowNull: true,
            validate: {
                len: {
                    args: [0, 255],
                    msg: 'Too long!'
                }
            }
        },
        PreviousName: {
            type: Sequelize.STRING(255),
            allowNull: true,
            validate: {
                len: {
                    args: [0, 255],
                    msg: 'Too long!'
                }
            }
        },
        DOB: {
            type: Sequelize.STRING(255),
            allowNull: true,
            validate: {
                len: {
                    args: [0, 255],
                    msg: 'Too long!'
                }
            }
        },
        Gender: {
            type: Sequelize.STRING(255),
            allowNull: true,
            comment: 'Male\nFemale\nOther: ...',
            validate: {
                len: {
                    args: [0, 255],
                    msg: 'Too long!'
                }
            }
        },
        Indigenous: {
            type: Sequelize.STRING(100),
            allowNull: true,
            comment: 'Indigenouns Status:\n   + Aboriginal\n   + Torres Strait Islander ',
            validate: {
                len: {
                    args: [0, 100],
                    msg: 'Too long!'
                }
            }
        },
        Occupation: {
            type: Sequelize.STRING(255),
            allowNull: true,
            validate: {
                len: {
                    args: [0, 255],
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
                }
            }
        },
        Address2: {
            type: Sequelize.STRING(255),
            allowNull: true,
            validate: {
                len: {
                    args: [0, 255],
                    msg: 'Too long!'
                }
            }
        },
        Postcode: {
            type: Sequelize.STRING(10),
            allowNull: true,
            validate: {
                len: {
                    args: [0, 10],
                    msg: 'Too long!'
                }
            }
        },
        Suburb: {
            type: Sequelize.STRING(100),
            allowNull: true,
            validate: {
                len: {
                    args: [0, 100],
                    msg: 'Too long!'
                }
            }
        },
        State: {
            type: Sequelize.STRING(100),
            allowNull: true,
            validate: {
                len: {
                    args: [0, 100],
                    msg: 'Too long!'
                }
            }
        },
        CountryID1: {
            type: Sequelize.BIGINT(20),
            allowNull: true,
            validate: {
                isInt: {
                    msg: 'Must be an integer!'
                }
            },
            references: {
                model: 'Country',
                key: 'ID'
            }
        },
        CountryID2: {
            type: Sequelize.BIGINT(20),
            allowNull: true,
            validate: {
                isInt: {
                    msg: 'Must be an integer!'
                }
            },
            references: {
                model: 'Country',
                key: 'ID'
            }
        },
        Email1: {
            type: Sequelize.STRING(255),
            allowNull: true,
            validate: {
                len: {
                    args: [0, 255],
                    msg: 'Too long!'
                }
            }
        },
        Email2: {
            type: Sequelize.STRING(255),
            allowNull: true,
            validate: {
                len: {
                    args: [0, 255],
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
        FaxNumber: {
            type: Sequelize.STRING(20),
            allowNull: true,
            validate: {
                len: {
                    args: [0, 20],
                    msg: 'Too long!'
                }
            }
        },
        InterpreterRequired: {
            type: Sequelize.STRING(1),
            allowNull: true,
            comment: 'Y/N',
            validate: {
                len: {
                    args: [0, 1],
                    msg: 'Too long!'
                }
            }
        },
        InterperterLanguage: {
            type: Sequelize.STRING(100),
            allowNull: true,
            validate: {
                len: {
                    args: [0, 100],
                    msg: 'Too long!'
                }
            }
        },
        OtherSpecialNeed: {
            type: Sequelize.STRING(255),
            allowNull: true,
            validate: {
                len: {
                    args: [0, 255],
                    msg: 'Too long!'
                }
            }
        },
        Enable: {
            type: Sequelize.STRING(1),
            allowNull: true,
            validate: {
                len: {
                    args: [0, 1],
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
        tableName: 'Patient',
        timestamps: false,
        hooks: {
            beforeCreate: function(patient, options, callback) {
                patient.CreatedDate = new Date();
                callback();
            },
            beforeBulkCreate: function(patients, options, callback) {
                patients.forEach(function(patient, index) {
                    patients[index].CreatedDate = new Date();
                });
                callback();
            },
            beforeUpdate: function(patient, options, callback) {
                patient.ModifiedDate = new Date();
                callback();
            }
        }
    }
};