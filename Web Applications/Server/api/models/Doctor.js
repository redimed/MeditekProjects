module.exports = {
    attributes: {
        ID: {
            type: Sequelize.BIGINT(20),
            autoIncrement: true,
            allowNull: false,
            primaryKey: true
        },
        UID: {
            type: Sequelize.STRING(255),
            allowNull: false
        },
        SiteID: {
            type: Sequelize.BIGINT(20),
            allowNull: false,
            references: {
                model: 'Site',
                key: 'ID'
            }
        },
        UserAccountID: {
            type: Sequelize.BIGINT(20),
            allowNull: false,
            references: {
                model: 'UserAccount',
                key: 'ID'
            }
        },
        FirstName: {
            type: Sequelize.STRING(50),
            allowNull: true,
            validate: {
                max: {
                    args: 50,
                    msg: 'First Name is too long'
                }
            }
        },
        MiddleName: {
            type: Sequelize.STRING(100),
            allowNull: true,
            validate: {
                max: {
                    args: 100,
                    msg: 'Middle Name is too long'
                }
            }
        },
        LastName: {
            type: Sequelize.STRING(50),
            allowNull: true,
            validate: {
                max: {
                    args: 50,
                    msg: 'Last Name is too long'
                }
            }
        },
        Dob: {
            type: Sequelize.DATE,
            allowNull: true,
            validate: {
                isDate: {
                    msg: 'Dob Invalid'
                }
            }
        },
        Email: {
            type: Sequelize.STRING(256),
            allowNull: true,
            validate: {
                isEmail: {
                    msg: 'Email Invalid!'
                },
                max: {
                    args: 256,
                    msg: 'Email is too long'
                }
            }
        },
        Phone: {
            type: Sequelize.STRING(12),
            allowNull: true,
            validate: {
                isNumeric: {
                    msg: 'Phone Invalid'
                }

            }
        },
        Enable: {
            type: Sequelize.STRING(1),
            allowNull: true,
            validate: {
                isIn: {
                    args: [['Y', 'N']],
                    msg: 'Must be Y or N'
                }
            }
        },
        CreationDate: {
            type: Sequelize.DATE,
            allowNull: true
        },
        CreatedBy: {
            type: Sequelize.BIGINT(20),
            allowNull: true
        },
        ModifiedDate: {
            type: Sequelize.DATE,
            allowNull: true
        },
        ModifiedBy: {
            type: Sequelize.BIGINT(20),
            allowNull: true
        }
    },
    associations: function() {},
    options: {
        tableName: 'Doctor',
        timestamps: false,
        createdAt: false,
        updatedAt: false
    }
};
