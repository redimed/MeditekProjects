"use strict";

module.exports = function(sequelize, DataTypes) {
    var EFormTemplate = sequelize.define("EFormTemplate", {
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
        Description: {
            type: DataTypes.TEXT()
        },
        Enable: {
            type: DataTypes.STRING(1),
            defaultValue: 1
        },
        Active: {
            type: DataTypes.STRING(1),
            defaultValue: 1
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
        tableName: 'EFormTemplate',
        classMethods: {
            associate: function(models) {
                EFormTemplate.hasOne(models.EFormTemplateData, {
                    foreignKey: 'EFormTemplateID',
                    as: 'EFormTemplateData'
                })
                EFormTemplate.hasOne(models.EForm, {
                    foreignKey: 'EFormTemplateID',
                    as: 'EForm'
                })
            }
        }
    });
    return EFormTemplate;
};