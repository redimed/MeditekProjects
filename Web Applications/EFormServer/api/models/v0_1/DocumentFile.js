module.exports = {
    attributes: {
        ID: {
            type: Sequelize.BIGINT(20),
            autoIncrement: true,
            allowNull: false,
            validate: {
                isInt: {
                    msg: 'Must be an integer!'
                }
            },
            primaryKey: true
        },
        FileUploadID: {
            type: Sequelize.BIGINT(20),
            allowNull: true,
            validate: {
                isInt: {
                    msg: 'Must be an integer!'
                }
            },
            references: {
                model: 'FileUpload',
                key: 'ID'
            }
        },
        DocType: {
            type: Sequelize.STRING(45),
            allowNull: true,
            comment: 'DOC, XLS, PDF, ...',
            validate: {
                len: {
                    args: [0, 45],
                    msg: 'Too long!'
                }
            }
        }
    },
    associations: function() {},
    options: {
        tableName: 'DocumentFile',
        timestamps: false,
        hooks: {}
    }
};
