module.exports = {
    attributes: {
        ID: {
            type: Sequelize.BIGINT(20),
            autoIncrement: true,
            allowNull: false,
            primaryKey: true
        },
        UserAccountID: {
            type: Sequelize.BIGINT(20),
            allowNull: false,
            references: {
                model: UserAccount,
                key: 'ID'
            }
        },
        FileUploadID: {
            type: Sequelize.BIGINT(20),
            allowNull: false,
            references: {
                model: FileUpload,
                key: 'ID'
            }
        },
        CreationDate: {
            type: Sequelize.DATE,
            allowNull: true
        },
        CreationBy: {
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
        tableName: 'UserFileUpload',
        timestamps: false
    }
};
