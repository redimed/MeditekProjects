module.exports = {
    attributes: {
        ID: {
            type: Sequelize.BIGINT(20),
            primaryKey: true,
            autoIncrement: true
        },
        EFormID: {
            type: Sequelize.BIGINT(20),
            references: {
                model: 'EForm',
                key: 'ID'
            }
        },
        PatientID: {
            type: Sequelize.BIGINT(20)
        }
    }, 
    associations: function() {},
    options: {
        tableName: 'RelEFormPatient',
        timestamps: false
    }
};