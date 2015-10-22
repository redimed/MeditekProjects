module.exports = {
    attributes: {
        ID: {
            type: Sequelize.BIGINT(20),
            autoIncrement: true,
            allowNull: false,
            primaryKey: true,
            validate : {
                    max: 9223372036854775807,
                    min: 1
            }
        },
        UID: {
            type: Sequelize.STRING(255),
            allowNull: false,
            validate : {
                is:/^[a-z0-9]{8}-[a-z0-9]{4}-[a-z0-9]{4}-[a-z0-9]{4}-[a-z0-9]{12}$/
            }
        },
        UserAccountID: {
            type: Sequelize.BIGINT(20),
            allowNull: true,
            references: {
                model: 'UserAccount',
                key: 'ID'
            },
            validate :{
                isNumeric : true
            }
        },
        Title: {
            type: Sequelize.STRING(45),
            allowNull: true,
            validate : {
                isIn : [['0', '1', '2', '3']]
            }
        },
        FirstName: {
            type: Sequelize.STRING(50),
            allowNull: true,
            validate: {
                is:/^[a-zA-Z]{0,50}$/
            }
        },
        MiddleName: {
            type: Sequelize.STRING(100),
            allowNull: true,
            validate: {
                is:/^[a-zA-Z]{0,100}$/
            }
        },
        LastName: {
            type: Sequelize.STRING(50),
            allowNull: true,
            validate: {
                is:/^[a-zA-Z]{0,50}$/
            }
        },
        DOB: {
            type: Sequelize.STRING(45),
            allowNull: true,
            validate: {
                is:/^(\d{4})-(\d{1,2})-(\d{1,2}) 00:00:00$/
            }
        },
        Gender: {
            type: Sequelize.STRING(1),
            allowNull: true,
            validate: {
                isIn: [['M', 'F']]
            }
        },
        Occupation: {
            type: Sequelize.STRING(255),
            allowNull: true,
            validate: {
                is:/^[a-zA-Z]{0,255}$/
            }
        },
        Address1: {
            type: Sequelize.STRING(255),
            allowNull: true,
            validate: {
                is:/^[a-zA-Z]{0,255}$/
            }
        },
        Address2: {
            type: Sequelize.STRING(255),
            allowNull: true,
            validate: {
                is:/^[a-zA-Z]{0,255}$/
            }
        },
        Suburb: {
            type: Sequelize.STRING(100),
            allowNull: true,
            validate: {
                is:/^[a-zA-Z]{0,100}$/
            }
        },
        Postcode: {
            type: Sequelize.STRING(100),
            allowNull: true,
            validate: {
                is:/^[0-9]{4,10}$/
            }
        },
        State: {
            type: Sequelize.STRING(100),
            allowNull: true,
            validate: {
                is:/^[a-zA-Z]{0,100}$/
            }
        },
        CountryID: {
            type: Sequelize.BIGINT(20),
            allowNull: true,
            references: {
                model: 'Country',
                key: 'ID'
            },
            validate: {
                isNumeric : true
            }
        },
        Email: {
            type: Sequelize.STRING(255),
            allowNull: true,
            validate: {
                isEmail : true
            }
        },
        HomePhoneNumber: {
            type: Sequelize.STRING(20),
            allowNull: true,
            validate: {
                is : /^[1-9]{9}$/
            }
        },
        WorkPhoneNumber: {
            type: Sequelize.STRING(20),
            allowNull: true,
            validate: {
                is : /^[1-9]{9}$/
            }
        },
        Enable: {
            type: Sequelize.STRING(1),
            allowNull: true
        },
        CreatedDate: {
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
        tableName: 'Patient',
        timestamps: false
    }
};
