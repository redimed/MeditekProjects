module.exports = {
    attributes: {
        ID: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        UID: {
            type: Sequelize.STRING
        },
        FromUserAccountID: {
            type: Sequelize.INTEGER
        },
        ToUserAccountID: {
            type: Sequelize.INTEGER
        },
        StartTime: {
            type: Sequelize.DATE
        },
        EndTime: {
            type: Sequelize.DATE
        },
        Status: {
            type: Sequelize.STRING
        },
        NetWorkSpeed: {
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
    options: {
        tableName: 'TelehealthCall',
        timestamps: false,
        hooks: {
            beforeCreate: function(telehealthcall, options, callback) {
                telehealthcall.CreatedDate = new Date();
                callback();
            },
            beforeUpdate: function(telehealthcall, options, callback) {
                telehealthcall.ModifiedDate = new Date();
                callback();
            }
        }
    }
};
