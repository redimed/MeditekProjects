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
        CompanyName: {
            type: Sequelize.BIGINT(255),
            allowNull: true
        },
        Enable: {
            type: Sequelize.BIGINT(1),
            allowNull: true
        },
        Active: {
            type: Sequelize.BIGINT(1),
            allowNull: true
        },
        Description: {
            type: Sequelize.TEXT,
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
        tableName: 'Company',
        timestamps: false
    }
};
