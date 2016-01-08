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
        AdmissionDataID: {
            type: Sequelize.BIGINT(20),
            allowNull: true,
            validate: {
                isInt: {
                    msg: 'Must be an integer!'
                }
            },
            references: {
                model: 'AdmissionData',
                key: 'ID'
            }
        },
        FileUploadID: {
            type: Sequelize.BIGINT(20),
            allowNull: true,
            validate: {
                isInt: {
                    msg: 'Must be an integer!'
                }
            },
            references: {
                model: 'FileUpload',
                key: 'ID'
            }
        }
    },
    associations: function() {},
    options: {
        tableName: 'RelAdmissionDataFileUpload',
        timestamps: false,
        hooks: {}
    }
};
