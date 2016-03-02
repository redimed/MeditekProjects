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
        SiteID: {
            type: Sequelize.BIGINT(20),
            allowNull: true,
            validate: {
                isInt: {
                    msg: 'Must be an integer!'
                }
            },
            references: {
                model: 'Site',
                key: 'ID'
            }
        },
        DepartmentCode: {
            type: Sequelize.STRING(100),
            allowNull: true,
            comment: 'DEP.0001',
            validate: {
                len: {
                    args: [0, 100],
                    msg: 'Too long!'
                }
            }
        },
        DepartmentName: {
            type: Sequelize.STRING(255),
            allowNull: true,
            comment: 'IT/ISO',
            validate: {
                len: {
                    args: [0, 255],
                    msg: 'Too long!'
                }
            }
        },
        Description: {
            type: Sequelize.TEXT,
            validate: {

                len: {
                    args: [0, 2048],
                    msg: 'Too long!'
                }
            }
        },
        Enable: {
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
        tableName: 'Department',
        timestamps: false,
        createdAt: 'CreatedDate',
        updatedAt: 'ModifiedDate',
        hooks: {}
    }
};
