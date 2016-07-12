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
        Name: {
            type: Sequelize.STRING(255),
            defaultValue: ''
        },
        EFormTemplateID: {
            type: Sequelize.BIGINT(20),
            references: {
                model: 'EFormTemplate',
                key: 'ID'
            }
        },
        Status: {
            type: Sequelize.STRING(45),
            defaultValue: 'saved'
        },
        Enable: {
            type: Sequelize.STRING(1),
            defaultValue: 'Y'
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
        tableName: 'EForm',
        createdAt: 'CreatedDate',
        updatedAt: 'ModifiedDate',
        hooks: {}
    }
};
