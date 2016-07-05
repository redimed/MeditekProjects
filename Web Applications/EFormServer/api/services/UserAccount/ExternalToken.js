/**
 * Created by tannguyen on 01/07/2016.
 */
var $q = require('q');
var o = require('../HelperService');
var moment = require('moment');

function Validation (userAccess) {
    var error = new Error('ExternalToken.Validation.Error');
    var q = $q.defer();
    try {
        var systems = o.getSystems();
        var mobileSystems = o.getMobileSystems();

        if (!_.isObject(userAccess) || _.isEmpty(userAccess)) {
            error.pushError("params.notProvided");
            throw error;
        }
        if(!userAccess.UserID) {
            error.pushError("user.notProvided");
            throw error;
        }
        if(!userAccess.ExternalName) {
            error.pushError('external.notProvided');
            throw error;
        }
        if(!userAccess.SystemType) {
            error.pushError('systemType.notProvided');
            throw error;
        } else  if (systems.indexOf(userAccess.SystemType)) {
            if(mobileSystems.indexOf(userAccess.SystemType) >= 0) {
                if (!userAccess.DeviceID) {
                    error.pushError('deviceId.notProvided');
                    throw error;
                }
                if (!userAccess.AppID) {
                    error.pushError('appId.notProvided');
                    throw error;
                }
            }
        } else {
            error.pushError('systemType.unknown');
            throw error;
        }
        q.resolve({status: 'success'});
    } catch (e) {
        q.reject(e);
    }
    return q.promise;
}

module.exports = {
    MakeExternalSecret: function(userAccess, transaction) {
        var error=new Error("MakeExternalSecret.Error");
        return Validation(userAccess)
        .then(function(data) {
            function CheckExist() {
                if (userAccess.SystemType == o.const.systemType.website) {
                    return ExternalToken.findOne({
                        where: {
                            UserAccountID: userAccess.UserID,
                            ExternalName: userAccess.ExternalName,
                            SystemType: o.const.systemType.website
                        },
                        transaction: transaction
                    });
                } else {
                    return ExternalToken.findOne({
                        where: {
                            UserAccountID: userAccess.UserID,
                            ExternalName: userAccess.ExternalName,
                            DeviceID: userAccess.DeviceID,
                            AppID: userAccess.AppID
                        }
                    })
                }
            }
            return CheckExist()
            .then(function(et) {
                if (et) {
                    return et.updateAttributes({
                        SecretKey: UUIDService.Create(),
                        SecretCreatedAt: new Date(),
                        TokenExpired: 2 * 60 * 60
                    }, {transaction: transaction})
                    .then(function(result) {
                        return result;
                    }, function(err) {
                        o.exlog(err);
                        error.pushError('externalToken.updateError');
                        throw error;
                    });
                } else {
                    var insertInfo = {
                        UID: UUIDService.Create(),
                        UserAccountID: userAccess.UserID,
                        ExternalName: userAccess.ExternalName,
                        SystemType: userAccess.SystemType,
                        SecretKey: UUIDService.Create(),
                        SecretCreatedAt: new Date(),
                        TokenExpired: 2 * 60 * 60
                    };
                    if (userAccess.SystemType != HelperService.const.systemType.website) {
                        insertInfo.DeviceID = userAccess.DeviceID;
                        insertInfo.AppID = userAccess.AppID;
                    }

                    return ExternalToken.create(insertInfo, {transaction: transaction})
                    .then(function(result) {
                        return result;
                    }, function(err) {
                        o.exlog(err);
                        error.pushError("externalToken.insertError");
                        throw error;
                    })
                }
            }, function (err) {
                o.exlog(err);
                error.pushError('externalToken.queryError');
                throw error;
            })
        }, function(err){
            throw err;
        })
    },

    GetExternalSecret: function(userAccess, transaction) {
        var error = new Error('GetExternalSecret.Error');
        return Validation(userAccess)
        .then(function(data) {
            function CheckExist() {
                if (userAccess.SystemType == o.const.systemType.website) {
                    return ExternalToken.findOne({
                        where: {
                            UserAccountID: userAccess.UserID,
                            ExternalName: userAccess.ExternalName,
                            SystemType: o.const.systemType.website
                        },
                        transaction: transaction
                    });
                } else {
                    return ExternalToken.findOne({
                        where: {
                            UserAccountID: userAccess.UserID,
                            ExternalName: userAccess.ExternalName,
                            DeviceID: userAccess.DeviceID,
                            AppID: userAccess.AppID
                        }
                    })
                }
            }
            return CheckExist()
            .then(function(et) {
                if(et) {
                    return et;
                } else {
                    error.pushError("externalToken.notFound");
                    throw error;
                }
            }, function(err){
                o.exlog(err);
                error.pushError('externalToken.queryError');
                throw error;
            })
        })
    }
}