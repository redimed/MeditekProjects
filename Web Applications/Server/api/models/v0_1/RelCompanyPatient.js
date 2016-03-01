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
        CompanyID: {
            type: Sequelize.BIGINT(20),
            allowNull: false,
            validate: {
                isInt: {
                    msg: 'Must be an integer!'
                }
            },
        },
        PatientID: {
            type: Sequelize.BIGINT(20),
            allowNull: false,
            validate: {
                isInt: {
                    msg: 'Must be an integer!'
                }
            },
        },
        Active: {
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
        tableName: 'RelCompanyPatient',
        timestamps: false,
        hooks: {
            beforeCreate: function(admission, options, callback) {
                admission.CreatedDate = new Date();
                callback();
            },
            beforeBulkCreate: function(admissions, options, callback) {
                admissions.forEach(function(admission, index) {
                    admissions[index].CreatedDate = new Date();
                });
                callback();
            },
            beforeBulkUpdate: function(admission, callback) {
                admission.fields.push('ModifiedDate');
                admission.attributes.ModifiedDate = new Date();
                callback();
            }
        }
    }
};
