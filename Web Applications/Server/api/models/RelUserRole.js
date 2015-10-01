module.exports = {
    attributes: {
        UserAccountId: {
            type: Sequelize.BIGINT(20),
            allowNull: false,
            references: {
                model: 'UserAccount',
                key: 'ID'
            }
        },
        RoleId: {
            type: Sequelize.BIGINT(20),
            allowNull: false,
            references: {
                model: 'Role',
                key: 'ID'
            }
        },
        ModuleId: {
            type: Sequelize.BIGINT(20),
            allowNull: false,
            references: {
                model: 'Module',
                key: 'ID'
            }
        },
        SiteId: {
            type: Sequelize.BIGINT(20),
            allowNull: false,
            references: {
                model: 'Site',
                key: 'ID'
            }
        },
        CreationDate: {
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
