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
        UserAccountID: {
            type: Sequelize.BIGINT(20),
            allowNull: false,
            validate: {
                isInt: {
                    msg: 'Must be an integer!'
                }
            },
        }
    },
    associations: function() {},
    options: {
        tableName: 'RelCompanyUserAccount',
        timestamps: false,
        hooks: {
            // beforeCreate: function(admission, options, callback) {
            //     admission.CreatedDate = new Date();
            //     callback();
            // },
            // beforeBulkCreate: function(admissions, options, callback) {
            //     admissions.forEach(function(admission, index) {
            //         admissions[index].CreatedDate = new Date();
            //     });
            //     callback();
            // },
            // beforeBulkUpdate: function(admission, callback) {
            //     admission.fields.push('ModifiedDate');
            //     admission.attributes.ModifiedDate = new Date();
            //     callback();
            // }
        }
    }
};
