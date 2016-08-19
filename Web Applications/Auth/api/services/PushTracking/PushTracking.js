/**
 * Created by tannguyen on 19/08/2016.
 */
var $q = require('q');
var o=require("../HelperService");
module.exports = {
    pushTrack: function(info, transaction) {
        var error = new Error("PushTracking.ERROR");
        var insertObj = {};
        var Validate = function () {
            var q = $q.defer();
            if(_.isObject(info) && !_.isEmpty(info) && info.Content) {
                insertObj.UserAccountID = info.UserAccountID||-1;
                insertObj.SystemType = info.SystemType||null;
                insertObj.DeviceID = info.DeviceID||null;
                insertObj.AppID = info.AppID||null;
                insertObj.TrackingName = info.TrackingName||null;
                insertObj.Content = JSON.stringify(info.Content)||null;
                insertObj.CreatedDate = new Date();
                q.resolve("success");
            } else {
                error.pushError("PushTracking.contentNull");
                q.reject(error);
            }
            return q.promise;
        }
        return Validate()
        .then(function(result){
            return PushTracking.create(insertObj,{transaction:transaction})
            .then(function(data){
                return data;
            },function(e){
                error.pushError("PushTracking.createError");
                throw error;
            })
        }, function(err) {
            throw err;
        })

    }
}