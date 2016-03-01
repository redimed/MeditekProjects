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
        ClinicalDetailID: {
            type: Sequelize.BIGINT(20),
            allowNull: true,
            validate: {
                isInt: {
                    msg: 'Must be an integer!'
                }
            },
            references: {
                model: 'ClinicalDetail',
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
        tableName: 'RelClinicalDetailFileUpload',
        timestamps: false,
        hooks: {}
    }
};
