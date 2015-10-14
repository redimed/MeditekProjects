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
        ISO2: {
            type: Sequelize.CHAR(2),
            allowNull: true
        },
        ShortName: {
            type: Sequelize.STRING(100),
            allowNull: true
        },
        LongName: {
            type: Sequelize.STRING(255),
            allowNull: true
        },
        ISO3: {
            type: Sequelize.CHAR(3),
            allowNull: true
        },
        NumCode: {
            type: Sequelize.STRING(6),
            allowNull: true
        },
        UnMember: {
            type: Sequelize.STRING(12),
            allowNull: true
        },
        CallingCode: {
            type: Sequelize.STRING(8),
            allowNull: true
        },
        CCTLD: {
            type: Sequelize.STRING(5),
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
        tableName: 'Country',
        timestamps: false
    }
};
