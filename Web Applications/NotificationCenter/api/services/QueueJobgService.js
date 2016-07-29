var o = require("./HelperService");
var moment = require('moment');
var $q = require('q');
module.exports = {
    CreateQueueJobg: function(queueJobg, transaction) {
        console.log("||||||||||||||||||||||||||||||||||| CreateQueueJobg")
        var error = new Error('CreateQueueJobg.Error');

        function Validate() {
            var q = $q.defer();
            try {
                var fields = {
                    Receiver: true,
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
                    EndTime: true,
                    Enable: true,
                }
                var requiredFields = {
                    Receiver: true,
                    ReceiverType: true,
                    // ReceiverUID:true,
                    Queue: true,
                    MsgContent: true,
                    EventName: true,
                    SendFromServer: true,
                    MsgKind: true,
                    // SenderUID:true,
                }

                queueJobg = o.rationalizeObject(queueJobg, fields);
                if (queueJobg.MsgContentType == 'JSON') {
                    queueJobg.MsgContent = JSON.stringify(queueJobg.MsgContent);
                }
                var listMissingFields = o.validateRequireFields(queueJobg, requiredFields);
                if (listMissingFields.length > 0) {
                    error.pushError({ 'requiredFields': listMissingFields });
                    throw error;
                }

                q.resolve({ status: 'success' });
            } catch (err) {
                q.reject(err);
            }
            return q.promise;
        }

        return Validate()
            .then(function(data) {
                if (queueJobg.FirstDelay && queueJobg.FirstDelay > 0)
                    queueJobg.Status = o.const.jobStatus.DELAY;
                else
                    queueJobg.Status = o.const.jobStatus.READY;
                console.log(queueJobg);
                return QueueJobg.create(queueJobg, { transaction: transaction })
                    .then(function(data) {
                        return data;
                    }, function(err) {
                        o.exlog(err);
                        error.pushError('QueueJobg.createError');
                        throw error;
                    })
            }, function(err) {
                throw err;
            })
    },

    GetQueueJobg: function(ID, transaction) {
        console.log("||||||||||||||||||||||||||||||||||| GetQueueJob")
        var error = new Error("GetQueueJob.Error");
        return QueueJobg.findOne({
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
    Requeue: function(queueJobg, transaction) {
        console.log("||||||||||||||||||||||||||||||||||| Requeue")

        var error = new Error("Requeue.Error");
        var Status = null;
        ReleaseCount = null;
        Status = (queueJobg.ReleaseDelay && queueJobg.ReleaseDelay) ? 'DELAY' : 'READY';
        ReleaseCount = (queueJobg.ReleaseCount) ? queueJobg.ReleaseCount : 0;
        ReleaseCount = ReleaseCount + 1;
        return queueJobg.updateAttributes({
                Status: Status,
                ReleaseCount: ReleaseCount,
                LastedSentAt: new Date(),
            }, { transaction: transaction })
            .then(function(qj) {
                QueueJobLoggService.AddLog(queueJobg.ID, 'Release');
                return qj;
            }, function(err) {
                console.log(err);
                error.pushError("update.error");
                this.BuryQueueJobg(queueJobg, error);
                throw error;
            })
    },

    FinishQueueJobg: function(queueJobg) {
        console.log("||||||||||||||||||||||||||||||||||| FinishQueueJobg")

        var error = new Error("FinishQueueJobg.Error");

        function updateStatus(qjg) {
            return qjg.updateAttributes({
                    Status: 'HANDLED',
                    LastedSentAt: new Date(),
                })
                .then(function(qjg) {
                    QueueJobLoggService.AddLog(qjg.ID, 'Handled');
                    return qjg;
                }, function(err) {
                    console.log(err);
                    error.pushError("update.error");
                    QueueJobLoggService.AddLog(qjg.ID, error);
                    throw error;
                })
        }

        if (_.isObject(queueJobg)) {
            return updateStatus(queueJobg);
        } else {
            var queueJobgID = queueJobg;
            return this.GetQueueJob(queueJobID)
                .then(function(qjg) {
                    return updateStatus(qjg);
                }, function(err) {
                    console.log(err);
                    error.pushError("query.error");
                    QueueJobLoggService.AddLog(queueJobID, error);
                    throw error;
                })
        }
    },

    BuryQueueJobg: function(queueJobg, log) {
        console.log("||||||||||||||||||||||||||||||||||| BuryQueueJobg")

        var error = new Error('BuryQueueJobg.Error');

        function updateStatus(qjg) {
            return qjg.updateAttributes({
                    Status: 'BURIED',
                })
                .then(function(qjg) {
                    QueueJobLoggService.AddLog(qjg.ID, log);
                    return qjg;
                }, function(err) {
                    console.log(err);
                    error.pushError("update.error");
                    QueueJobLoggService.AddLog(qjg.ID, error);
                    throw error;
                })
        }

        if (_.isObject(queueJobg)) {
            return updateStatus(queueJobg);
        } else {
            var queueJobgID = queueJobg;
            return this.GetQueueJob(queueJobID)
                .then(function(qjg) {
                    return updateStatus(qjg);
                }, function(err) {
                    console.log(err);
                    error.pushError("query.error");
                    QueueJobLoggService.AddLog(queueJobgID, error);
                    throw error;
                })
        }
    },

    whereClause: function(data) {
        var whereClause = {};
        if (data.Search.Role) {
            whereClause.Receiver = data.Search.Role;
            // whereClause.$or = [
            //     { EndTime: { $gte: moment(new Date()).format('YYYY-MM-DD HH:mm:ss Z'), }, },
            //     { EndTime: null }
            // ];
            whereClause.Enable = 'Y';

            whereClause.$and = [{
                $or: [
                    { Status: 'HANDLED' },
                    { SenderUID: data.Search.UID }
                ],
            }, {
                $or: [
                    { EndTime: { $gte: moment(new Date()).format('YYYY-MM-DD HH:mm:ss Z'), }, },
                    { EndTime: null }
                ]
            }];
        };
        if (data.Search.SenderUID) {
            whereClause.SenderUID = data.Search.SenderUID
        };
        if (data.Search.Sender) {
            whereClause.SenderAccount.UserName = {
                like: '%' + data.Search.Sender + '%'
            }
        };
        if (data.Search.queue) {
            whereClause.Queue = data.Search.queue
        };
        if (data.Search.MsgContent) {
            whereClause.MsgContent = {
                like: '%"Action":"%' + data.Search.MsgContent + '%"}%'
            }
        };
        if (data.Search.Object) {
            whereClause.MsgContent = {
                like: '%"Object":{"name":"%' + data.Search.Object + '%","%'
            }
        };
        if (data.Search.Subject) {
            whereClause.Subject = {
                like: '%' + data.Search.Subject + '%'
            }
        };
        if (data.Search.Status) {
            whereClause.Status = {
                like: '%' + data.Search.Status + '%'
            }
        };
        if (data.Search.CreatedDate) {
            whereClause.CreatedDate = {
                $lt: moment(data.Search.CreatedDate).add(1, 'days')
                    // like: '%' + data.Search.Subject + '%'
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
        // if (data.Search.Read) {
        //     whereClause.Read = data.Search.Read
        // };

        return whereClause;
    },

    LoadListQueueJobg: function(info) {
        var q = $q.defer();

        var whereClause = QueueJobgService.whereClause(info);

        var limit = info.limit;
        var offset = info.offset;

        QueueJobg.findAndCountAll({
            offset: offset,
            limit: limit,
            where: whereClause,
            include: {
                model: UserAccount,
                attributes: ['UserName'],
                as: 'SenderAccount'
            },
            order: info.order
        }).then(function(data) {
            whereClause.Read = {
                $notLike: '%' + info.Search.UID + '%'
            };
            QueueJobg.count({
                where: whereClause
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
            // q.resolve({
            //     status: 'success',
            //     data: data.rows,
            //     count: data.count,
            // });
        }, function(err) {
            console.log("GetListQueueByRole", err);
            q.reject(err);
        });
        return q.promise;
    },

    ChangeEnableQueueJobg: function(info) {
        var q = $q.defer();
        QueueJobg.update({
            Enable: info.Enable
        }, {
            where: { ID: info.ID }
        }).then(function(data) {
            q.resolve({
                status: 'success'
            });
        }, function(err) {
            q.reject(err);
        });
        return q.promise;
    },

    ChangeReadQueueJobg: function(info) {
        var q = $q.defer();
        QueueJobg.update({
            Read: info.Read
        }, {
            where: { ID: info.ID }
        }).then(function(data) {
            q.resolve({
                status: 'success'
            });
        }, function(err) {
            q.reject(err);
        });
        return q.promise;
    },

    ChangeReadAllQueueJobg: function(info) {
        var q = $q.defer();
        console.log("info", info);

        QueueJobg.findAndCountAll({
            where: {
                Queue: info.queue,
                Receiver: info.Role,
                Read: {
                    $notLike: '%' + info.UID + '%'
                },
                Enable: 'Y',
                $and: [{
                    $or: [
                        { Status: 'HANDLED' },
                        { SenderUID: info.UID }
                    ]
                }, {
                    $or: [
                        { EndTime: { $gte: moment(new Date()).format('YYYY-MM-DD HH:mm:ss Z'), }, },
                        { EndTime: null }
                    ]
                }]
            }
        }).then(function(queuejobgs) {
            console.log("_________________________________");
            console.log(queuejobgs.count);
            console.log("_________________________________");
            for (var i = 0; i < queuejobgs.rows.length; i++) {
                QueueJobg.update({
                    Read: queuejobgs.rows[i].Read ? queuejobgs.rows[i].Read + ',' + info.UID : info.UID
                }, {
                    where: { ID: queuejobgs.rows[i].ID }
                }).then(function(data) {
                    q.resolve({
                        status: 'success'
                    });
                }, function(err) {
                    q.reject(err);
                });
            };
        });
        return q.promise;
    }
}
