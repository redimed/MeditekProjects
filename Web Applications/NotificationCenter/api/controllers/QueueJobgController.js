module.exports = {
    CreateGlobalNotifyJob: function(req, res) {
        console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>> Global Notification");
        var body = req.body;
        var delay = 0;

        if (body.data) {
            if (body.data.FirstDelay) delay = body.data.FirstDelay;
        };

        console.log(body);

        if (!body.data) {
            var payload = body;
            QueueJobgService.CreateQueueJobg(payload).then(function(data) {
                var job = {
                    type: 'sendglobalnotify',
                    payload: data.dataValues
                }
                BeansService.putJob('GLOBALNOTIFY', 0, delay, 20, JSON.stringify(job)).then(function(result) {
                    console.log(result);
                    res.ok(result);
                }, function(err) {
                    res.serverError(ErrorWrap(err));
                })
            }, function(err) {
                res.serverError(ErrorWrap(err));
            });
        } else {
            for (var i = 0; i < body.data.Role.length; i++) {
                var payload = {
                    Subject: body.data.Subject,
                    Receiver: body.data.Role[i],
                    ReceiverType: body.data.Role[i],
                    Queue: 'GLOBALNOTIFY',
                    Read: 'N',
                    Enable: 'Y',
                    MsgContentType: 'JSON',
                    MsgContent: {
                        Display: {
                            FirstName: '',
                            LastName: '',
                            Subject: body.data.UserName,
                            Action: body.data.MsgContent
                        },
                        Command: {
                            Note: 'NotifyMessage',
                            Url_State: body.data.Url_State,
                            Url_Redirect: body.data.Url_Redirect,
                            Fun: body.data.Fun
                        }
                    },
                    MsgKind: body.data.MsgKind,
                    FirstDelay: body.data.FirstDelay,
                    EndTime: body.data.EndTime,
                    SenderUID: body.data.UID,
                    EventName: 'globalnotify',
                    SendFromServer: '3016',
                };

                QueueJobgService.CreateQueueJobg(payload).then(function(data) {
                    var job = {
                        type: 'sendglobalnotify',
                        payload: data.dataValues
                    }
                    BeansService.putJob('GLOBALNOTIFY', 0, delay, 20, JSON.stringify(job)).then(function(result) {
                        console.log(result);
                        res.ok(result);
                    }, function(err) {
                        res.serverError(ErrorWrap(err));
                    })
                }, function(err) {
                    res.serverError(ErrorWrap(err));
                });
            };
        };
    },

    LoadListQueueJobg: function(req, res) {
        try {
            console.log("LoadListQueueJobg");
            var info = req.body.data;
            QueueJobgService.LoadListQueueJobg(info).then(function(data) {
                res.ok({
                    status: 'success',
                    data: data.data,
                    count: data.count,
                    countAll: data.countAll,
                });
            }, function(err) {
                res.serverError(ErrorWrap(err));
            });
        } catch (err) {
            console.log("LoadListQueueJobg", err);
        }
    },

    ChangeEnableQueueJobg: function(req, res) {
        try {
            console.log("ChangeEnableQueueJobg");
            var info = req.body.data;
            QueueJobgService.ChangeEnableQueueJobg(info).then(function(data) {
                res.ok({
                    status: 'success',
                    data: data.data,
                    count: data.count,
                });
            }, function(err) {
                res.serverError(ErrorWrap(err));
            });
        } catch (err) {
            console.log("ChangeEnableQueueJobg", err);
        };
    },

    ChangeReadQueueJobg: function(req, res) {
        try {
            console.log("ChangeReadQueueJobg");
            var info = req.body.data;
            if (info.Read) {
                info.Read = info.Read + "," + info.UserUID;
            } else {
                info.Read = info.UserUID;
            };
            QueueJobgService.ChangeReadQueueJobg(info).then(function(data) {
                res.ok({
                    status: 'success',
                    data: data.data,
                    count: data.count,
                });
            }, function(err) {
                res.serverError(ErrorWrap(err));
            });
        } catch (err) {
            console.log("ChangeReadQueueJobg", err);
        };
    },

    ChangeReadAllQueueJobg: function(req, res) {
        try {
            console.log("ChangeReadAllQueueJobg");
            var info = req.body.data;
            QueueJobgService.ChangeReadAllQueueJobg(info).then(function(data) {
                res.ok({
                    status: 'success',
                });
            }, function(err) {
                res.serverError(ErrorWrap(err));
            });
        } catch (err) {
            console.log("ChangeReadAllQueueJobg", err);
        };
    }
}
