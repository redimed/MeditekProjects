module.exports = {
    attributes: {
        ID: {
            type: Sequelize.BIGINT(20),
            autoIncrement: true,
            allowNull: false,
            validate: {
                isInt: {
                    msg: 'Must be an integer!'
                },
                max: 9223372036854775807,
                min: 1
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
                },
                is: /^[a-z0-9]{8}-[a-z0-9]{4}-[a-z0-9]{4}-[a-z0-9]{4}-[a-z0-9]{12}$/
            }
        },
        UserAccountID: {
            type: Sequelize.BIGINT(20),
            allowNull: true,
            validate: {
                isInt: {
                    msg: 'Must be an integer!'
                },
                isNumeric: true
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
                },
                is: /^[a-zA-Z0-9\s]{0,100}$/
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
        PreferredName: {
            type: Sequelize.STRING(255),
            allowNull: true,
            validate: {
                len: {
                    args: [0, 255],
                    msg: 'Too long!'
                },
                is: /^[a-zA-Z0-9\s]{0,255}$/
            }
        },
        PreviousName: {
            type: Sequelize.STRING(255),
            allowNull: true,
            validate: {
                len: {
                    args: [0, 255],
                    msg: 'Too long!'
                },
                is: /^[a-zA-Z0-9\s]{0,255}$/
            }
        },
        DOB: {
            type: Sequelize.STRING(255),
            allowNull: true,
            validate: {
                len: {
                    args: [0, 255],
                    msg: 'Too long!'
                },
                is: /^(\d{1,2})[/-](\d{1,2})[/-](\d{4})$/
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
                },
                isIn: [
                    ['Male', 'Female', 'Other']
                ]
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
                },
                is: /^[a-zA-Z0-9\s]{0,255}$/
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
        CountryID1: {
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
        CountryID2: {
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
        Email1: {
            type: Sequelize.STRING(255),
            allowNull: true,
            validate: {
                len: {
                    args: [0, 255],
                    msg: 'Too long!'
                },
                // isEmail : true
            }
        },
        Email2: {
            type: Sequelize.STRING(255),
            allowNull: true,
            validate: {
                len: {
                    args: [0, 255],
                    msg: 'Too long!'
                },
                //isEmail : true
            }
        },
        HomePhoneNumber: {
            type: Sequelize.STRING(20),
            allowNull: true,
            validate: {
                len: {
                    args: [0, 20],
                    msg: 'Too long!'
                },
                is: /^[0-9]{6,10}$/
            }
        },
        WorkPhoneNumber: {
            type: Sequelize.STRING(20),
            allowNull: true,
            validate: {
                len: {
                    args: [0, 20],
                    msg: 'Too long!'
                },
                is: /^[0-9]{6,10}$/
            }
        },
        FaxNumber: {
            type: Sequelize.STRING(20),
            allowNull: true,
            validate: {
                len: {
                    args: [0, 20],
                    msg: 'Too long!'
                },
                is: /^[1-9]{9}$/
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
        Education: {
            type: Sequelize.STRING(255),
            allowNull: true,
            validate: {
                len: {
                    args: [0, 255],
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
        createdAt: 'CreatedDate',
        updatedAt: 'ModifiedDate',
        hooks: {}
    }
};
