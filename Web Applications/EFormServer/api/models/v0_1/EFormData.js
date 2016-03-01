module.exports = {
    attributes: {
        ID: {
            type: Sequelize.BIGINT(20),
            primaryKey: true,
            autoIncrement: true
        },
        UID: {
            type: Sequelize.UUID(),
            defaultValue: Sequelize.UUIDV4
        },
        FormData: {
            type: Sequelize.TEXT()
        },
        EFormID: {
            type: Sequelize.BIGINT(20),
            references: {
                model: 'EForm',
                key: 'ID'
            }
        },
        CreatedDate: {
            type: Sequelize.DATE(),
            defaultValue: Sequelize.NOW()
        },
        ModifiedDate: {
            type: Sequelize.DATE(),
            defaultValue: Sequelize.NOW()
        },
        CreatedBy: {
            type: Sequelize.BIGINT(20)
        },
        ModifiedBy: {
            type: Sequelize.BIGINT(20)
        }
    }, 
    associations: function() {},
    options: {
        tableName: 'EFormData',
        timestamps: false
    }
};