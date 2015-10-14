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
        FromUserAccountID: {
            type: Sequelize.BIGINT(20),
            allowNull: false
        },
        ToUserAccountID: {
            type: Sequelize.BIGINT(20),
            allowNull: false
        },
        StartTime: {
            type: Sequelize.DATE,
            allowNull: true
        },
        EndTime: {
            type: Sequelize.DATE,
            allowNull: true
        },
        Status: {
            type: Sequelize.STRING(50),
            allowNull: true
        },
        NetWorkSpeed: {
            type: Sequelize.STRING(50),
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
        tableName: 'TelehealthCall',
        timestamps: false
    }
};
