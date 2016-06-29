var o = require("./HelperService");
var $q = require('q');
module.exports = {
    CreateQueueJob: function(queueJob, transaction) {
        console.log("||||||||||||||||||||||||||||||||||| CreateQueueJob")
        var error = new Error('CreateQueueJob.Error');

        function Validate() {
            var q = $q.defer();
            try {
                var fields = {
                    Receiver: true,
                    CC: true,
                    ReceiverType: true,
                    ReceiverUID: true,
                    Queue: true,
                    Read: true,
                    EventName: true,
                    MsgContent: true,
                    Subject: true,
                    MsgContentType: true,
                    FirstDelay: true,
                    ReleaseDelay: true,
                    MaxRelease: true,
                    SendFromServer: true,
                    SenderType: true,
                    SenderUID: true,
                }
                var requiredFields = {
                    Receiver: true,
                    ReceiverType: true,
                    // ReceiverUID:true,
                    Queue: true,
                    MsgContent: true,
                    EventName: true,
                    SendFromServer: true,
                    // SenderType:true,
                    // SenderUID:true,
                }

                queueJob = o.rationalizeObject(queueJob, fields);
                if (queueJob.MsgContentType == 'JSON') {
                    queueJob.MsgContent = JSON.stringify(queueJob.MsgContent);
                }
                var listMissingFields = o.validateRequireFields(queueJob, requiredFields);
                if (listMissingFields.length > 0) {
                    error.pushError({ 'requiredFields': listMissingFields });
                    throw error;
                }
                if (queueJob.Queue == o.const.queue.SMS) {
                    if (!o.isValidPhoneNumber(queueJob.Receiver)) {
                        error.pushError("Receiver.PhoneNumber.Invalid");
                        throw error;
                    }
                }
                if (queueJob.Queue == o.const.queue.EMAIL) {
                    if (!o.isValidEmail(queueJob.Receiver)) {
                        error.pushError("Receiver.Email.Invalid");
                        throw error;
                    }
                }

                q.resolve({ status: 'success' });
            } catch (err) {
                q.reject(err);
            }
            return q.promise;
        }

        return Validate()
            .then(function(data) {
                if (queueJob.FirstDelay && queueJob.FirstDelay > 0)
                    queueJob.Status = o.const.jobStatus.DELAY;
                else
                    queueJob.Status = o.const.jobStatus.READY;
                console.log(queueJob);
                return QueueJob.create(queueJob, { transaction: transaction })
                    .then(function(data) {
                        return data;
                    }, function(err) {
                        o.exlog(err);
                        error.pushError('QueueJob.createError');
                        throw error;
                    })
            }, function(err) {
                throw err;
            })

    },

    GetQueueJob: function(ID, transaction) {
        console.log("||||||||||||||||||||||||||||||||||| GetQueueJob")
        var error = new Error("GetQueueJob.Error");
        return QueueJob.findOne({
                where: {
                    ID: ID
                },
                transaction: transaction
            })
            .then(function(data) {
                return data;
            }, function(err) {
                o.exlog(err);
                error.pushError("query.error");
                throw error;
            })
    },

    //Dua job quay tro lai queue
    //Cac field can update:
    //Status: READY hay DELAY
    //ReleaseCount: day la la release thu bao nhieu
    //LastedSentAt: thoi diem cuoi cung send message
    Requeue: function(queueJob, transaction) {
        console.log("||||||||||||||||||||||||||||||||||| Requeue")

        var error = new Error("Requeue.Error");
        var Status = null;
        ReleaseCount = null;
        Status = (queueJob.ReleaseDelay && queueJob.ReleaseDelay) ? 'DELAY' : 'READY';
        ReleaseCount = (queueJob.ReleaseCount) ? queueJob.ReleaseCount : 0;
        ReleaseCount = ReleaseCount + 1;
        return queueJob.updateAttributes({
                Status: Status,
                ReleaseCount: ReleaseCount,
                LastedSentAt: new Date(),
            }, { transaction: transaction })
            .then(function(qj) {
                QueueJobLogService.AddLog(queueJob.ID, 'Release');
                return qj;
            }, function(err) {
                console.log(err);
                error.pushError("update.error");
                this.BuryQueueJob(queueJob, error);
                throw error;
            })
    },

    FinishQueueJob: function(queueJob) {
        console.log("||||||||||||||||||||||||||||||||||| FinishQueueJob")

        var error = new Error("FinishQueueJob.Error");
        /*return queueJob.updateAttributes({
            Status:'HANDLED',
            LastedSentAt:new Date(),
        })
        .then(function(qj){
            QueueJobLogService.AddLog(queueJob.ID,'Handled');
            return qj;
        },function(err){
            console.log(err);
            error.pushError('update.error');
            this.BuryQueueJob(queueJob,error);
            throw error;
        })*/

        function updateStatus(qj) {
            return qj.updateAttributes({
                    Status: 'HANDLED',
                    LastedSentAt: new Date(),
                })
                .then(function(qj) {
                    QueueJobLogService.AddLog(qj.ID, 'Handled');
                    return qj;
                }, function(err) {
                    console.log(err);
                    error.pushError("update.error");
                    QueueJobLogService.AddLog(qj.ID, error);
                    throw error;
                })
        }

        if (_.isObject(queueJob)) {
            return updateStatus(queueJob);
        } else {
            var queueJobID = queueJob;
            return this.GetQueueJob(queueJobID)
                .then(function(qj) {
                    return updateStatus(qj);
                }, function(err) {
                    console.log(err);
                    error.pushError("query.error");
                    QueueJobLogService.AddLog(queueJobID, error);
                    throw error;
                })
        }
    },

    BuryQueueJob: function(queueJob, log) {
        console.log("||||||||||||||||||||||||||||||||||| BuryQueueJob")

        var error = new Error('BuryQueueJob.Error');

        function updateStatus(qj) {
            return qj.updateAttributes({
                    Status: 'BURIED',
                })
                .then(function(qj) {
                    QueueJobLogService.AddLog(qj.ID, log);
                    return qj;
                }, function(err) {
                    console.log(err);
                    error.pushError("update.error");
                    QueueJobLogService.AddLog(qj.ID, error);
                    throw error;
                })
        }

        if (_.isObject(queueJob)) {
            return updateStatus(queueJob);
        } else {
            var queueJobID = queueJob;
            return this.GetQueueJob(queueJobID)
                .then(function(qj) {
                    return updateStatus(qj);
                }, function(err) {
                    console.log(err);
                    error.pushError("query.error");
                    QueueJobLogService.AddLog(queueJobID, error);
                    throw error;
                })
        }
    },

    GetListQueueByRole: function(userUID, queue) {
        console.log("||||||||||||||||||||||||||||||||| LoadListQueueByRole Service");

        var q = $q.defer();

        QueueJob.findAll({
            where: {
                Queue: queue,
                ReceiverUID: userUID,
            },
            order: 'CreatedDate DESC'
        }).then(function(data) {
            QueueJob.count({
                where: {
                    Queue: queue,
                    Read: 'N',
                    ReceiverUID: userUID,
                }
            }).then(function(count) {
                q.resolve({
                    status: 'success',
                    data: data,
                    count: count,
                });
            },function(err) {
                console.log("GetListQueueByRoleCount", err);
            });
        }, function(err) {
            console.log("GetListQueueByRole", err);
            q.reject(err);
        });
        return q.promise;
    },

    UpdateReadQueueJob: function(userUID, queue) {
        console.log("||||||||||||||||||||||||||||||||| UpdateReadQueueJob Service");

        var q = $q.defer();

        QueueJob.update({
            Read: 'Y'
        }, {
            where: {
                ReceiverUID: userUID,
                queue: queue,
                Read: 'N',
            }
        }).then(function(data) {
            q.resolve({
                status: 'success',
                data: data
            });
        }, function(err) {
            q.reject(err);
        });
        return q.promise;
    }
}
