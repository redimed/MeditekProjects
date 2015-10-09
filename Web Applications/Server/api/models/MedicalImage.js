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
            allowNull: false
        },
        BodyPart: {
            type: Sequelize.STRING(255),
            allowNull: true
        }
    },
    associations: function() {},
    options: {
        tableName: 'MedicalImage',
        timestamps: false
    }
};
