module.exports = {
    /*
    Create: Create message queue, check confirm, tried send mail
    input: UIDUR - urgent request UID, UIDMQ - message queue UID
    output: resend 3rd email if send failed
    */
    CreateMessageQueue: function(UIDUR, UIDMQ, fn) {
        setTimeout(function() {
            //update status completed for message queue
            MessageQueue.update({
                    status: 'spending',
                    completedTime: null
                }, {
                    status: 'completed',
                    completedTime: Services.moment().format('YYYY-MM-DD HH:mm:ss')
                })
                .where({
                    UID: UIDMQ
                })
                .then(function(MQUpdated) {
                    var UR = UrgentRequest.findOne()
                        .where({
                            UID: UIDUR
                        })
                        .then(function(UR) {
                            return UR;
                        });
                    return [UR];
                })
                .spread(function(UR) {
                    //check tried and confirmed urgent request
                    if (UR.tried < 3 && UR.confirmed === 0) {
                        var emailInfo = {
                            from: 'Health Screenings <HealthScreenings@redimed.com.au>',
                            email: 'HealthScreenings@redimed.com.au',
                            subject: '[Testing] -[UrgentCare Request] - [' + (UR.tried === 2 ? '2th' : '3rd') + '] - [' +
                                Services.moment(UR.requestDate).format('DD/MM/YYYY HH:mm:ss') +
                                '] - [' + UR.lastName + ' ' +
                                UR.firstName + '] - [' + UR.phoneNumber + ']',
                            confirmed: APIService.UrgentCareConfirmURL + '/' + UR.UID,
                            urgentCareType: 'UrgentCare Request',
                            patientName: UR.lastName + ' ' + UR.firstName,
                            requestDate: Services.moment(UR.requestDate).format('DD/MM/YYYY HH:mm:ss'),
                            phoneNumber: UR.phoneNumber
                        };
                        var CallBackSendMail = function(err, responseStatus, html, text) {
                                if (err) {
                                    console.log(err);
                                }
                            }
                            //send mail
                        SendMailService.SendMail('UrgentRequest', emailInfo, CallBackSendMail);

                        //create message queue
                        UrgentRequest.findOne()
                            .where({
                                UID: UIDUR
                            })
                            .exec(function(err, urgentRequest) {
                                if (err) {
                                    console.log(err);
                                    return fn(err);
                                } else {
                                    var dataMQ = {
                                        UID: UUIDService.Create(),
                                        urgentRequestID: urgentRequest.ID,
                                        source: 'Urgent Request',
                                        sourceID: 1,
                                        job: 'Receive email urgent request',
                                        status: 'spending',
                                        startTime: Services.moment().format('YYYY-MM-DD HH:mm:ss')
                                    };
                                    console.log(dataMQ);
                                    MessageQueue.create({
                                            UID: dataMQ.UID,
                                            urgentRequestID: dataMQ.urgentRequestID,
                                            source: dataMQ.source,
                                            sourceID: dataMQ.sourceID,
                                            job: dataMQ.job,
                                            status: dataMQ.status,
                                            startTime: dataMQ.startTime
                                        })
                                        .exec(function(err, MQCreated) {
                                            if (err) {
                                                console.log(err);
                                                return fn(err);
                                            } else {
                                                UrgentRequest.update({
                                                        tried: UR.tried
                                                    }, {
                                                        tried: UR.tried + 1
                                                    })
                                                    .exec(function(URUpdated) {
                                                        //recursive this function
                                                        module.exports.CreateMessageQueue(UIDUR, dataMQ.UID);
                                                    });
                                            }
                                        });
                                }
                            });
                    }
                })
                .catch(function(err) {
                    console.log(err);
                    return fn(err);
                });
        }, MessageQueueService.GetMSecond(5));
    },
    GetMSecond: function(Minute) {
        return (Minute * 60 * 1000);
    }
};
