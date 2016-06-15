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
        UserAccountID: {
            type: Sequelize.INTEGER
        },
        FirstName: {
            type: Sequelize.STRING
        },
        LastName: {
            type: Sequelize.STRING
        },
        DOB: {
            type: Sequelize.DATE
        },
        Address1: {
            type: Sequelize.STRING
        },
        Address2: {
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
        },
        Status: {
            type: Sequelize.STRING
        }
    },
    associations: function() {
        TelehealthUser.belongsTo(UserAccount, {
            foreignKey: 'UserAccountID'
        });
    },
    options: {
        tableName: 'TelehealthUser',
        timestamps: false,
        hooks: {
            beforeCreate: function(telehealthuser, options, callback) {
                telehealthuser.CreatedDate = new Date();
                callback();
            },
            beforeUpdate: function(telehealthuser, options, callback) {
                telehealthuser.ModifiedDate = new Date();
                callback();
            }
        }
    }
};