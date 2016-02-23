"use strict";

module.exports = function(sequelize, DataTypes) {
    var EFormTemplateData = sequelize.define("EFormTemplateData", {
        ID: {
            type: DataTypes.BIGINT(20),
            primaryKey: true,
            autoIncrement: true
        },
        UID: {
            type: DataTypes.UUID(),
            defaultValue: DataTypes.UUIDV4
        },
        EFormTemplateID: {
            type: DataTypes.BIGINT(20),
            references: {
                model: 'EFormTemplate',
                key: 'ID'
            }
        },
        TemplateData: {
            type: DataTypes.TEXT()
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
        tableName: 'EFormTemplateData',
        classMethods: {
            associate: function(models) {
                EFormTemplateData.belongsTo(models.EFormTemplate, {
                    foreignKey: 'EFormTemplateID',
                })
            }
        }
    });
    return EFormTemplateData;
};