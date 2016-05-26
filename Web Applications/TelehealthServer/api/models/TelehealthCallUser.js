module.exports = {
    attributes: {
        ID: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        TelehealthCallID: {
            type: Sequelize.INTEGER
        },
        TelehealthUserID: {
            type: Sequelize.INTEGER
        },
        Latitude: {
            type: Sequelize.STRING
        },
        Longitude: {
            type: Sequelize.STRING
        },
        Address: {
            type: Sequelize.STRING
        },
        CreatedDate: {
            type: Sequelize.DATE
        },
        CreatedBy: {
            type: Sequelize.INTEGER
        },
        ModifiedDate: {
            type: Sequelize.DATE
        },
        ModifiedBy: {
            type: Sequelize.INTEGER
        }
    },
    associations: function() {
        TelehealthCallUser.belongsTo(TelehealthCall, {
            foreignKey: 'TelehealthCallID'
        });
        TelehealthCallUser.belongsTo(TelehealthUser, {
            foreignKey: 'TelehealthUserID'
        });
    },
    options: {
        tableName: 'TelehealthCallUser',
        timestamps: false,
        // createdAt: 'CreatedDate',
        // updatedAt: 'ModifiedDate',
        hooks: {
            beforeCreate: function(telehealthcalluser, options, callback) {
                telehealthcalluser.CreatedDate = new Date();
                callback();
            },
            beforeBulkCreate: function(telehealthcallusers, options, callback) {
                telehealthcallusers.forEach(function(telehealthcalluser, index) {
                    telehealthcallusers[index].CreatedDate = new Date();
                });
                callback();
            },
            beforeUpdate: function(telehealthcalluser, options, callback) {
                telehealthcalluser.ModifiedDate = new Date();
                callback();
            }
        }
    }
};
