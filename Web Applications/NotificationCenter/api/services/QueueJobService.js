var o = require("./HelperService");
var moment = require('moment');
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
                    MsgKind: true,
                    MsgContentType: true,
                    FirstDelay: true,
                    ReleaseDelay: true,
                    MaxRelease: true,
                    SendFromServer: true,
                    SenderType: true,
                    SenderUID: true,
                    Enable: true,
                    MsgState: true,
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
        var q = $q.defer();

        QueueJob.findAll({
            where: {
                Queue: queue,
                ReceiverUID: userUID,
            },
            include: {
                model: UserAccount,
                attributes: ['UID', 'UserName'],
                as: 'SenderAccount'
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
            }, function(err) {
                console.log("GetListQueueByRoleCount", err);
            });
        }, function(err) {
            console.log("GetListQueueByRole", err);
            q.reject(err);
        });
        return q.promise;
    },

    whereClause: function(data) {
        var whereClause = {};
        if (data.Search.userUID) {
            whereClause.ReceiverUID = data.Search.userUID
        };
        if (data.Search.queue) {
            whereClause.Queue = data.Search.queue
        };
        if (data.Search.kind) {
            whereClause.MsgKind = data.Search.kind
        };
        if (data.Search.kind === 'Review' && data.Search.type) {
            whereClause.Subject = data.Search.type
        };
        if (data.Search.SenderUID) {
            whereClause.SenderUID = data.Search.SenderUID;
        } else {
            whereClause.Enable = 'Y';
            whereClause.Status = o.const.jobStatus.HANDLED;
        };
        if (data.Search.MsgContent) {
            whereClause.MsgContent = {
                like: '%"Action":"%' + data.Search.MsgContent + '%"}%'
            }
        };
        if (data.Search.Subject) {
            whereClause.Subject = {
                like: '%' + data.Search.Subject + '%'
            }
        };
        if (data.Search.Object) {
            whereClause.MsgContent = {
                like: '%"Object":{"name":"%' + data.Search.Object + '%","%'
            }
        };
        if (data.Search.FromCreatedDate && !data.Search.ToCreatedDate) {
            whereClause.CreatedDate = {
                $gte: data.Search.FromCreatedDate,
                $lt: moment(data.Search.FromCreatedDate).add(1, 'days').format('YYYY-MM-DD HH:mm:ss Z')
            }
        };
        if (!data.Search.FromCreatedDate && data.Search.ToCreatedDate) {
            whereClause.CreatedDate = {
                $gte: data.Search.ToCreatedDate,
                $lt: moment(data.Search.ToCreatedDate).add(1, 'days').format('YYYY-MM-DD HH:mm:ss Z')
            }
        };
        if (data.Search.FromCreatedDate && data.Search.ToCreatedDate) {
            whereClause.CreatedDate = {
                $gte: data.Search.FromCreatedDate,
                $lt: moment(data.Search.ToCreatedDate).add(1, 'days').format('YYYY-MM-DD HH:mm:ss Z')
            }
        };
        return whereClause;
    },

    GetListQueueByRoleSearch: function(info) {
        var q = $q.defer();

        var whereClause = QueueJobService.whereClause(info);

        var whereClauseAccount = {
            Sender: {},
            Receiver: {},
        };

        if (info.Search.SenderAccount) {
            whereClauseAccount.Sender.UserName = {
                like: '%' + info.Search.SenderAccount + '%'
            }
        };
        if (info.Search.ReceiverAccount) {
            whereClauseAccount.Receiver.UserName = {
                like: '%' + info.Search.ReceiverAccount + '%'
            }
        };

        var limit = info.limit;
        var offset = info.offset;

        QueueJob.findAndCountAll({
            offset: offset,
            limit: limit,
            where: whereClause,
            include: [{
                model: UserAccount,
                attributes: ['UserName'],
                as: 'SenderAccount',
                where: whereClauseAccount.Sender
            }, {
                model: UserAccount,
                attributes: ['UserName'],
                as: 'ReceiverAccount',
                where: whereClauseAccount.Receiver
            },{
                model: UserAccount,
                attributes: ['UserName'],
                as: 'ModifiedAccount'
            }],
            order: info.order
        }).then(function(data) {
            whereClause.Read = 'N';
            QueueJob.count({
                where: whereClause,
                include: [{
                    model: UserAccount,
                    attributes: ['UserName'],
                    as: 'SenderAccount',
                    where: whereClauseAccount.Sender
                }, {
                    model: UserAccount,
                    attributes: ['UserName'],
                    as: 'ReceiverAccount',
                    where: whereClauseAccount.Receiver
                }],
            }).then(function(count) {
                q.resolve({
                    status: 'success',
                    data: data.rows,
                    count: count,
                    countAll: data.count
                });
            }, function(err) {
                console.log("GetListQueueByRoleCount", err);
            });
        }, function(err) {
            console.log("GetListQueueByRole", err);
            q.reject(err);
        });
        return q.promise;
    },

    UpdateReadQueueJob: function(info) {
        var q = $q.defer();
        var userUID = info.userUID;
        var queue = info.queue;
        var whereClause = {
            ReceiverUID: userUID,
            Queue: queue,
            Read: 'N',
        };
        if (info.ID) {
            whereClause.ID = info.ID;
        };
        QueueJob.update({
            Read: 'Y'
        }, {
            where: whereClause
        }).then(function(data) {
            q.resolve({
                status: 'success',
                data: data
            });
        }, function(err) {
            q.reject(err);
        });
        return q.promise;
    },

    ChangeEnableQueueJob: function(info) {
        var q = $q.defer();
        UserAccount.findOne({
            where: {
                UID: info.UserUID
            },
            attributes: ['ID'],
        }).then(function(data0) {
            QueueJob.update({
                Enable: info.Enable,
                ModifiedBy: data0.ID
            }, {
                where: { ID: info.ID }
            }).then(function(data) {
                q.resolve({
                    status: 'success'
                });
            }, function(err) {
                q.reject(err);
            });
        }, function(err) {
            q.reject(err);
        });
        return q.promise;
    },

    UpdateStateQueueJob: function(info) {
        var q = $q.defer();
        UserAccount.findOne({
            where: {
                UID: info.UserUID
            },
            attributes: ['ID'],
        }).then(function(data0) {
            QueueJob.update({
                MsgState: info.MsgState,
                ModifiedBy: data0.ID
            }, {
                where: { ID: info.ID }
            }).then(function(data) {
                q.resolve({
                    status: 'success'
                });
            }, function(err) {
                q.reject(err);
            });
        }, function(err) {
            q.reject(err);
        });
        return q.promise;
    },
}
