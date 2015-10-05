module.exports = {
    attributes: {
        ID: {
            type: Sequelize.BIGINT(20),
            autoIncrement: true,
            allowNull: false,
            primaryKey: true
        },
        FileUploadID: {
            type: Sequelize.BIGINT(20),
            allowNull: false,
            references: {
                model: 'FileUpload',
                key: 'ID'
            }
        },
        DocType: {
            type: Sequelize.STRING(45),
            allowNull: true
        }
    },
    associations: function() {},
    options: {
        tableName: 'DocumentFile',
        timestamps: false
    }
};
