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
            allowNull: false
        },
        SiteID: {
            type: Sequelize.BIGINT(20),
            allowNull: true,
            references: {
                model: 'Site',
                key: 'ID'
            }
        },
        FromTime: {
            type: Sequelize.DATE,
            allowNull: true
        },
        ToTime: {
            type: Sequelize.DATE,
            allowNull: true
        },
        RequestDate: {
            type: Sequelize.DATE,
            allowNull: true
        },
        ApprovalDate: {
            type: Sequelize.DATE,
            allowNull: true
        },
        Status: {
            type: Sequelize.STRING(45),
            allowNull: true
        },
        Enable: {
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
        tableName: 'Appointment',
        timestamps: false,
        hooks: {
            // beforeCreate: function(appt, options, callback) {
            //     appt.CreationDate = new Date();
            //     callback();
            // },
            // beforeUpdate: function(appt, options, callback) {
            //     appt.ModifiedDate = new Date();
            //     callback();
            // }
        }
    }
};
