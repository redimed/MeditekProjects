module.exports = {
    attributes: {
        ID: {
            type: Sequelize.BIGINT(20),
            autoIncrement: true,
            allowNull: false,
            primaryKey: true
        },
        UID: {
            type: Sequelize.STRING(255),
            allowNull: true
        },
        UserAccountID: {
            type: Sequelize.BIGINT(20),
            allowNull: true,
            references: {
                model: 'UserAccount',
                key: 'ID'
            }
        },
        FileName: {
            type: Sequelize.STRING(255),
            allowNull: true
        },
        FileLocation: {
            type: Sequelize.STRING(255),
            allowNull: true
        },
        FileType: {
            type: Sequelize.STRING(45),
            allowNull: true
        },
        FileExtension: {
            type: Sequelize.STRING(45),
            allowNull: true
        },
        Description: {
            type: Sequelize.TEXT
        },
        Enable: {
            type: Sequelize.STRING(1)
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
        tableName: 'FileUpload',
        timestamps: false
    }
};
