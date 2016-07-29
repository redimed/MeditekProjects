var app = angular.module('app.authentication.notification.service', []);

app.factory('notificationServices', function(NcRestangular, $q, Restangular) {
    var services = {};
    var ncApi = NcRestangular.all("api");
    var api = Restangular.all("api");

    services.SendMsgPrivate = function(data) {
        return api.all("private/createprivatenotify").post({
            data: data
        });
    };

    services.SendMsgGlobal = function(data) {
        return api.all("global/createglobalnotify").post({
            data: data
        });
    };

    services.getListNotify = function(data) {
        return ncApi.all("queue/loadlistqueue").post({
            data: data
        });
    };

    services.getListNotifySearch = function(data) {
        return ncApi.all("queue/loadlistqueuesearch").post({
            data: data
        });
    };

    services.ChangeEnableQueueJob = function(data) {
        return ncApi.all("queue/changeenablequeuejob").post({
            data: data
        });
    };

    services.LoadListGlobalNotify = function(data) {
        return ncApi.all("queueq/loadlistglobalnotify").post({
            data: data
        });
    };

    services.ChangeEnableQueueJobg = function(data) {
        return ncApi.all("queueq/changeenablequeuejobg").post({
            data: data
        });
    };

    services.ChangeReadQueueJobg = function(data) {
        return ncApi.all("queueq/changereadqueuejobg").post({
            data: data
        });
    };

    services.ChangeReadAllQueueJobg = function(data) {
        return ncApi.all("queueq/changereadallqueuejobg").post({
            data: data
        });
    };

    services.validate = function(info, msg) {
        var error = [];
        var q = $q.defer();
        try {
            //validate Subject
            if (!info.Subject) {
                error.push({ field: "Subject", message: "required" });
            };

            //validate MsgContent
            if (!info.MsgContent) {
                error.push({ field: "MsgContent", message: "required" });
            };

            //validate FirstDelay
            if (info.FirstDelay && !moment(info.FirstDelay, 'DD/MM/YYYY HH:mm').isValid()) {
                error.push({ field: "FirstDelay", message: "invalid value" });
            };

            if (info.FirstDelay && moment(info.FirstDelay, 'DD/MM/YYYY HH:mm').format('YYYY-MM-DD HH:mm') < moment(new Date()).format('YYYY-MM-DD HH:mm')) {
                error.push({ field: "FirstDelay", message: "invalid value (FirstDelay > Today)" });
            };

            if (msg === 'global') {
                var Roles = [{
                    id: 'ADMIN',
                    role: 'Admin'
                }, {
                    id: 'PATIENT',
                    role: 'Patient'
                }, {
                    id: 'INTERNAL_PRACTITIONER',
                    role: 'Internal'
                }, {
                    id: 'EXTERTAL_PRACTITIONER',
                    role: 'Extertal'
                }, {
                    id: 'ASSISTANT',
                    role: 'Assistant'
                }, {
                    id: 'ORGANIZATION',
                    role: 'Organization'
                }];

                var Role = [];

                //validate Role
                if (!info.Role) {
                    error.push({ field: "Role", message: "required" });
                } else {
                    var push = true;
                    for (var i = 0; i < Roles.length; i++) {
                        if (info.Role[Roles[i].role]) {
                            push = false;
                            Role.push(info.Role[Roles[i].role]);
                        };
                    };
                    if (push) {
                        error.push({ field: "Role", message: "required" });
                    };
                };

                //validate EndTime
                if (!info.EndTime) {
                    error.push({ field: "EndTime", message: "required" });
                };
                if (!moment(info.EndTime, 'DD/MM/YYYY').isValid()) {
                    error.push({ field: "EndTime", message: "invalid value" });
                };
                if (moment(info.EndTime, 'DD/MM/YYYY').format('YYYY-MM-DD') < moment(new Date()).format('YYYY-MM-DD')) {
                    error.push({ field: "EndTime", message: "invalid value (EndTime > Today)" });
                };

                // validate FirstDelay EndTime
                if (info.FirstDelay && moment(info.FirstDelay, 'DD/MM/YYYY').format('YYYY-MM-DD') > moment(info.EndTime, 'DD/MM/YYYY').format('YYYY-MM-DD')) {
                    error.push({ field: "FirstDelay", message: "invalid value (FirstDelay < EndTime)" });
                };
            } else if (msg === 'private') {
                if (info.lsUser <= 0) {
                    error.push({ field: "User", message: "required" });
                };
            };

            console.log(error.length);

            if (error.length > 0) {
                throw error;
            } else {
                q.resolve({
                    Role: Role,
                    Status: 'success'
                });
            };

        } catch (error) {
            q.reject(error);
        };
        return q.promise;
    };

    return services;
});
