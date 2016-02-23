"use strict";

module.exports = function(sequelize, DataTypes) {
    var EFormData = sequelize.define("EFormData", {
        ID: {
            type: DataTypes.BIGINT(20),
            primaryKey: true,
            autoIncrement: true
        },
        UID: {
            type: DataTypes.UUID(),
            defaultValue: DataTypes.UUIDV4
        },
        FormData: {
            type: DataTypes.TEXT()
        },
        EFormID: {
            type: DataTypes.BIGINT(20),
            references: {
                model: 'EForm',
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
        tableName: 'EFormData',
        classMethods: {
            associate: function(models) {
                EFormData.hasOne(models.EFormTemplateData, {
                    foreignKey: 'EFormTemplateID',
                    as: 'EFormTemplateData'
                })
                EFormData.belongsTo(models.EForm, {
                    foreignKey: 'EFormID',
                })
            }
        }
    });
    return EFormData;
};