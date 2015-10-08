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
        DepartmentCode: {
            type: Sequelize.STRING(100),
            allowNull: true
        },
        Description: {
            type: Sequelize.TEXT
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
        tableName: 'Department',
        timestamps: false
    }
};
