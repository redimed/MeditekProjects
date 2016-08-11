module.exports = {
    CreateGlobalNotifyJob: function(req, res) {
        console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>> Global Notification");
        var body = req.body;
        QueueJobgService.CreateQueueJobg(body).then(function(data) {
            if (body.MsgKind != "Reference") {
                sails.sockets.broadcast(body.SenderUID, "LoadList", { message: 'success', data: data });
            };
            var job = {
                type: 'sendglobalnotify',
                payload: data.dataValues
            }
            BeansService.putJob('GLOBALNOTIFY', 0, body.FirstDelay, 20, JSON.stringify(job)).then(function(result) {
                console.log(result);
                res.ok(result);
            }, function(err) {
                res.serverError(ErrorWrap(err));
            })
        }, function(err) {
            res.serverError(ErrorWrap(err));
        });
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
