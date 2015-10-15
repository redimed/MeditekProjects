module.exports = {
    attributes: {
        ID: {
            type: Sequelize.BIGINT(20),
            autoIncrement: true,
            allowNull: false,
            primaryKey: true
        },
        UserAccountId: {
            type: Sequelize.BIGINT(20),
            allowNull: true,
            references: {
                model: 'UserAccount',
                key: 'ID'
            }
        },
        RoleId: {
            type: Sequelize.BIGINT(20),
            allowNull: true,
            references: {
                model: 'Role',
                key: 'ID'
            }
        },
        SiteId: {
            type: Sequelize.BIGINT(20),
            allowNull: true,
            references: {
                model: 'Site',
                key: 'ID'
            }
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
        tableName: 'RelUserRole',
        timestamps: false
    }
};
