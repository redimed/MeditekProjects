module.exports = {
    attributes: {
        UserAccountUID: {
            type: Sequelize.STRING(255),
            allowNull: false,
            validate: {
                len: {
                    args: [0, 255],
                    msg: 'Too long!'
                }
            },
            references: {
                model: 'UserAccount',
                key: 'ID'
            }
        },
        TokenCreatedDate: {
            type: Sequelize.DATE,
            allowNull: true,
            validate: {
                isDate: {
                    msg: 'Invalid!'
                }
            }
        },
        TokenExpire: {
            type: Sequelize.INTEGER(11),
            allowNull: true,
            validate: {

                isInt: {
                    msg: 'Must be an integer!'
                }
            }
        },
        Token: {
            type: Sequelize.STRING(255),
            allowNull: false,
            validate: {
                len: {
                    args: [0, 255],
                    msg: 'Too long!'
                }
            }
        }
    },
    associations: function() {},
    options: {
        tableName: 'UserForgot',
        timestamps: false,
        hooks: {}
    }
};
