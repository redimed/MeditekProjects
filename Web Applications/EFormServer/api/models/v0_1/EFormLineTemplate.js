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
        EFormQuestionTemplateID: {
            type: Sequelize.BIGINT(20),
            allowNull: true,
            validate: {
                isInt: {
                    msg: 'Must be an integer!'
                }
            }
        },
        Name: {
            type: Sequelize.STRING(255),
            allowNull: true,
            validate: {
                len: {
                    args: [0, 255],
                    msg: 'Too long!'
                }
            }
        },
        Value: {
            type: Sequelize.TEXT,
            allowNull: true
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
        tableName: 'EFormLineTemplate',
        timestamps: false,
        hooks: {
            beforeCreate: function(examinationrequired, options, callback) {
                examinationrequired.CreatedDate = new Date();
                callback();
            },
            beforeBulkCreate: function(examinationrequireds, options, callback) {
                examinationrequireds.forEach(function(examinationrequired, index) {
                    examinationrequireds[index].CreatedDate = new Date();
                });
                callback();
            },
            beforeBulkUpdate: function(examinationrequired, callback) {
                examinationrequired.fields.push('ModifiedDate');
                examinationrequired.attributes.ModifiedDate = new Date();
                callback();
            }
        }
    }
};
