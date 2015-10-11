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
                    status: 'queueing',
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
                    if (UR.tried < 3 && UR.status === 'pending') {
                        var subjectEmail = '[Testing] -[' + UR.urgentRequestType + '] - [' + (UR.tried == 1 ? '2nd' : '3rd') + '] - [' +
                            Services.moment(UR.requestDate).format('DD/MM/YYYY HH:mm:ss') +
                            '] - [' + UR.firstName + ' ' +
                            UR.lastName + '] - [' + UR.phoneNumber + ']';
                        var emailInfo = {
                            from: 'Redimed UrgentCare <HealthScreenings@redimed.com.au>',
                            email: 'HealthScreenings@redimed.com.au',
                            subject: subjectEmail,
                            confirmed: APIService.UrgentCareConfirmURL + '/' + UR.UID,
                            urgentRequestType: UR.urgentRequestType,
                            patientName: UR.firstName + ' ' + UR.lastName,
                            requestDate: Services.moment(UR.requestDate).format('DD/MM/YYYY HH:mm:ss'),
                            phoneNumber: UR.phoneNumber,
                            companyName: UR.companyName,
                            companyPhoneNumber: UR.companyPhoneNumber,
                            contactPerson: UR.contactPerson,
                            bcc: 'pnguyen@redimed.com.au, thanh1101681@gmail.com'
                        };
                        var CallBackSendMail = function(err, responseStatus, html, text) {
                                if (err) {
                                    console.log(err);
                                }
                            }
                            //send mail
                        if (emailInfo.urgentRequestType === 'WorkInjury') {
                            SendMailService.SendMail('WorkInjuryRequest', emailInfo, CallBackSendMail);
                        } else {
                            SendMailService.SendMail('UrgentRequest', emailInfo, CallBackSendMail);
                        }

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
                                        status: 'pending',
                                        startTime: Services.moment().format('YYYY-MM-DD HH:mm:ss')
                                    };
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
