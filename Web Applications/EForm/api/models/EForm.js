"use strict";

module.exports = function(sequelize, DataTypes) {
    var EForm = sequelize.define("EForm", {
        ID: {
            type: DataTypes.BIGINT(20),
            primaryKey: true,
            autoIncrement: true
        },
        UID: {
            type: DataTypes.UUID(),
            defaultValue: DataTypes.UUIDV4
        },
        Name: {
            type: DataTypes.STRING(255),
            defaultValue: ''
        },
        EFormTemplateID: {
            type: DataTypes.BIGINT(20),
            references: {
                model: 'EFormTemplate',
                key: 'ID'
            }
        },
        CreatedDate: {
            type: DataTypes.DATE(),
            defaultValue: DataTypes.NOW()
        },
        ModifiedDate: {
            type: DataTypes.DATE(),
            defaultValue: DataTypes.NOW()
        },
        CreatedBy: {
            type: DataTypes.BIGINT(20)
        },
        ModifiedBy: {
            type: DataTypes.BIGINT(20)
        }
    }, 
    {
        timestamps: false,
        tableName: 'EForm',
        classMethods: {
            associate: function(models) {
                EForm.belongsTo(models.EFormTemplate, {
                    foreignKey: 'EFormTemplateID',
                })
                EForm.hasOne(models.EFormData, {
                    foreignKey: 'EFormID',
                    as: 'EFormData'
                })
            }
        }
    });
    return EForm;
};