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
            allowNull: true,
            references: {
                model: 'FileUpload',
                key: 'ID'
            }
        },
        BodyPart: {
            type: Sequelize.STRING(100),
            allowNull: true
        }
    },
    associations: function() {},
    options: {
        tableName: 'MedicalImage',
        timestamps: false
    }
};
