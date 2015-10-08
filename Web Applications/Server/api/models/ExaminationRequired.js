module.exports = {
    attributes: {
        ID: {
            type: Sequelize.BIGINT(20),
            autoIncrement: true,
            allowNull: false,
            primaryKey: true
        },
        TelehealthAppointmentID: {
            type: Sequelize.BIGINT(20),
            allowNull: false,
            references: {
                model: 'TelehealthAppointment',
                key: 'ID'
            }
        },
        Private: {
            type: Sequelize.STRING(1),
            allowNull: true
        },
        Public: {
            type: Sequelize.STRING(1),
            allowNull: true
        },
        DVA: {
            type: Sequelize.STRING(1),
            allowNull: true
        },
        WorkersComp: {
            type: Sequelize.STRING(1),
            allowNull: true
        },
        MVIT: {
            type: Sequelize.STRING(1),
            allowNull: true
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
        tableName: 'ExaminationRequired',
        timestamps: false,
        hooks: {
            beforeCreate: function(examRequired, options, callback) {
                examRequired.CreatedDate = new Date();
                callback();
            },
            beforeUpdate: function(examRequired, options, callback) {
                examRequired.ModifiedDate = new Date();
                callback();
            }
        }
    }
};
