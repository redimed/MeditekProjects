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
        InjuryType: {
            type: Sequelize.STRING(255),
            allowNull: true,
            validate: {
                len: {
                    args: [0, 255],
                    msg: 'Too long!'
                }
            }
        },
        HasConsultant: {
            type: Sequelize.STRING(1),
            allowNull: true,
            validate: {
                len: {
                    args: [0, 1],
                    msg: 'Too long!'
                }
            }
        },
        ConsultantName: {
            type: Sequelize.STRING(255),
            allowNull: true,
            validate: {
                len: {
                    args: [0, 255],
                    msg: 'Too long!'
                }
            }
        },
        ConsultantSite: {
            type: Sequelize.STRING(255),
            allowNull: true,
            validate: {
                len: {
                    args: [0, 255],
                    msg: 'Too long!'
                }
            }
        },
        ConsultantContactNumber: {
            type: Sequelize.STRING(20),
            allowNull: true,
            validate: {
                len: {
                    args: [0, 20],
                    msg: 'Too long!'
                }
            }
        },
        ConsultantNote: {
            type: Sequelize.TEXT,
            validate: {

                len: {
                    args: [0, 2048],
                    msg: 'Too long!'
                }
            }
        },
        RefFax: {
            type: Sequelize.STRING(20),
            allowNull: true,
            validate: {
                len: {
                    args: [0, 20],
                    msg: 'Too long!'
                }
            }
        },
        IsUsualGP: {
            type: Sequelize.STRING(1),
            allowNull: true,
            comment: 'Is the referrer the patients usual GP?\nY/N',
            validate: {
                len: {
                    args: [0, 1],
                    msg: 'Too long!'
                }
            }
        },
        UsualGPName: {
            type: Sequelize.STRING(255),
            allowNull: true,
            comment: 'If no, name of patients usual GP',
            validate: {
                len: {
                    args: [0, 255],
                    msg: 'Too long!'
                }
            }
        },
        UsualGPContactNumber: {
            type: Sequelize.STRING(20),
            allowNull: true,
            validate: {
                len: {
                    args: [0, 20],
                    msg: 'Too long!'
                }
            }
        },
        UsualGPFaxNumber: {
            type: Sequelize.STRING(20),
            allowNull: true,
            validate: {
                len: {
                    args: [0, 20],
                    msg: 'Too long!'
                }
            }
        },
        IsSamePlacePreference: {
            type: Sequelize.STRING(1),
            allowNull: true,
            comment: 'If the patient has been referred to this speciality for the same condition before, do they need to be referred to the same place again?',
            validate: {
                len: {
                    args: [0, 1],
                    msg: 'Too long!'
                }
            }
        },
        IsTelehealthSuitable: {
            type: Sequelize.STRING(1),
            allowNull: true,
            comment: 'Is the patient suitable for a telehealth consult',
            validate: {
                len: {
                    args: [0, 1],
                    msg: 'Too long!'
                }
            }
        },
        IsRenewReferral: {
            type: Sequelize.STRING(1),
            allowNull: true,
            comment: 'Is this a renewed referral?\nY/N',
            validate: {
                len: {
                    args: [0, 1],
                    msg: 'Too long!'
                }
            }
        },
        PathologyProvider: {
            type: Sequelize.STRING(255),
            allowNull: true,
            validate: {
                len: {
                    args: [0, 255],
                    msg: 'Too long!'
                }
            }
        },
        RadiologyProvider: {
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
        tableName: 'WAAppointment',
        createdAt: 'CreatedDate',
        updatedAt: 'ModifiedDate',
        hooks: {}
    }
};
