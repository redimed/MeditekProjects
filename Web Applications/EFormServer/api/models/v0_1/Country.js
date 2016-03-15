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
        ISO2: {
            type: Sequelize.CHAR(2),
            allowNull: true,
            comment: 'VN',
            validate: {

                len: {
                    args: [0, 2],
                    msg: 'Too long!'
                }
            }
        },
        ShortName: {
            type: Sequelize.STRING(100),
            allowNull: true,
            comment: 'Vietnam',
            validate: {
                len: {
                    args: [0, 100],
                    msg: 'Too long!'
                }
            }
        },
        LongName: {
            type: Sequelize.STRING(255),
            allowNull: true,
            comment: 'Socialist Republic of Vietnam',
            validate: {
                len: {
                    args: [0, 255],
                    msg: 'Too long!'
                }
            }
        },
        ISO3: {
            type: Sequelize.CHAR(3),
            allowNull: true,
            comment: 'VNM',
            validate: {

                len: {
                    args: [0, 3],
                    msg: 'Too long!'
                }
            }
        },
        NumCode: {
            type: Sequelize.STRING(6),
            allowNull: true,
            comment: '704',
            validate: {
                len: {
                    args: [0, 6],
                    msg: 'Too long!'
                }
            }
        },
        UnMember: {
            type: Sequelize.STRING(12),
            allowNull: true,
            comment: 'yes',
            validate: {
                len: {
                    args: [0, 12],
                    msg: 'Too long!'
                }
            }
        },
        CallingCode: {
            type: Sequelize.STRING(8),
            allowNull: true,
            comment: '84',
            validate: {
                len: {
                    args: [0, 8],
                    msg: 'Too long!'
                }
            }
        },
        CCTLD: {
            type: Sequelize.STRING(5),
            allowNull: true,
            comment: '.vn',
            validate: {
                len: {
                    args: [0, 5],
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
        tableName: 'Country',
        createdAt: 'CreatedDate',
        updatedAt: 'ModifiedDate',
        hooks: {}
    }
};
