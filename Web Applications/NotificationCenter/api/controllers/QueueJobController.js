module.exports = {
    CreateEmailJob: function(req, res) {
        console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>> Join Notification");
        var body = req.body;
        QueueJobService.CreateQueueJob(body)
            .then(function(data) {
                // res.ok(data);
                var job = {
                    type: 'sendmail',
                    payload: data.dataValues
                }
                BeansService.putJob('EMAIL', 0, 0, 20, JSON.stringify(job))
                    .then(function(result) {
                        console.log(result);
                        res.ok(result);
                    }, function(err) {
                        res.serverError(ErrorWrap(err));
                    })

            }, function(err) {
                res.serverError(ErrorWrap(err));
            })

    },

    CreateSMSJob: function(req, res) {
        var body = req.body;
        QueueJobService.CreateQueueJob(body)
            .then(function(data) {
                // res.ok(data);
                var job = {
                    type: 'sendsms',
                    payload: data.dataValues
                }
                BeansService.putJob('SMS', 0, 0, 20, JSON.stringify(job))
                    .then(function(result) {
                        console.log(result);
                        res.ok(result);
                    }, function(err) {
                        res.serverError(ErrorWrap(err));
                    })

            }, function(err) {
                res.serverError(ErrorWrap(err));
            })

    },

    CreateNotifyJob: function(req, res) {
        var body = req.body;
        console.log("CreateNotifyJob");

        QueueJobService.CreateQueueJob(body)
            .then(function(data) {
                var job = {
                    type: 'sendnotify',
                    payload: data.dataValues
                }

                BeansService.putJob('NOTIFY', 0, body.FirstDelay, 20, JSON.stringify(job))
                    .then(function(result) {
                        console.log(result);
                        res.ok(result);
                    }, function(err) {
                        res.serverError(ErrorWrap(err));
                    })

            }, function(err) {
                res.serverError(ErrorWrap(err));
            })
    },

    FinishQueueJob: function(req, res) {
        var queueJobID = req.body.queueJobID;
        QueueJobService.FinishQueueJob(queueJobID)
            .then(function(qj) {
                res.ok({ status: 'success' });
            }, function(err) {
                res.serverError(ErrorWrap(err));
            })
    },

    BuryQueueJob: function(req, res) {
        var queueJobID = req.body.queueJobID;
        var log = req.body.log;
        QueueJobService.BuryQueueJob(queueJobID, log)
            .then(function(qj) {
                res.ok({ status: 'success' });
            }, function(err) {
                res.serverError(ErrorWrap(err));
            })
    },

    LoadListQueue: function(req, res) {
        try {
            console.log("LoadListQueue");
            var data = req.body.data;
            var userUID = data.userUID;
            var queue = data.queue;

            QueueJobService.GetListQueueByRole(userUID, queue).then(function(data) {
                // console.log("data", data.data);
                res.ok({
                    status: 'success',
                    data: data.data,
                    count: data.count,
                });
            }, function(err) {
                res.serverError(ErrorWrap(err));
            });
        } catch (err) {
            console.log("LoadListQueue", err);
        }
    },

    LoadListQueueSearch: function(req, res) {
        try {
            console.log("LoadListQueue Search");
            var data = req.body.data;

            QueueJobService.GetListQueueByRoleSearch(data).then(function(data) {
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
            console.log("LoadListQueue Search", err);
        }
    },

    UpdateReadQueueJob: function(req, res) {
        try {
            console.log("UpdateReadQueueJob");
            var info = req.body.data;
            QueueJobService.UpdateReadQueueJob(info).then(function(data) {
                res.ok({
                    status: 'success',
                    data: data.data
                });
            }, function(err) {
                res.serverError(ErrorWrap(err));
            });
        } catch (err) {
            console.log("UpdateReadQueueJob", err);
        }
    },

    ChangeEnableQueueJob: function(req, res) {
        try {
            console.log("ChangEnableQueueJob");
            var info = req.body.data;
            QueueJobService.ChangeEnableQueueJob(info).then(function(data) {
                res.ok({
                    status: 'success',
                    data: data.data
                });
            }, function(err) {
                res.serverError(ErrorWrap(err));
            });
        } catch (err) {
            console.log("ChangEnableQueueJob", err);
        }
    }
}
