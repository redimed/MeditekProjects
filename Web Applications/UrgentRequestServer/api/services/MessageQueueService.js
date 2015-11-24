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
                        var subjectEmail = '[' + UR.urgentRequestType + '] - [' + (UR.tried == 1 ? '2nd' : '3rd') + '] - [' +
                            Services.moment(UR.requestDate).format('DD/MM/YYYY HH:mm:ss') +
                            '] - [' + UR.firstName + ' ' +
                            UR.lastName + '] - [' + UR.phoneNumber + ']';
                        var GPReferral = Services.ConvertData.GPReferral(UR.GPReferral);
                        var serviceType = Services.ConvertData.ServiceType(UR, UR.urgentRequestType === 'WorkInjury');
                        var treatmentType = Services.ConvertData.TreatmentType(UR);
                        var emailInfo = {
                            from: 'Redimed UrgentCare <onlinebooking@redimed.com.au>',
                            email: 'onlinebooking@redimed.com.au',
                            patientEmail: (HelperService.CheckExistData(UR.email) && UR.email.length !== 0) ? UR.email : '(None)',
                            subject: subjectEmail,
                            confirmed: APIService.UrgentCareConfirmURL + '/' + UR.UID,
                            urgentRequestType: (HelperService.CheckExistData(UR.urgentRequestType) && UR.urgentRequestType.length !== 0) ? UR.urgentRequestType : '(None)',
                            patientName: UR.firstName + ' ' + UR.lastName,
                            requestDate: (HelperService.CheckExistData(UR.requestDate) && UR.requestDate.length !== 0) ? Services.moment(UR.requestDate).format('DD/MM/YYYY HH:mm:ss') : '(None)',
                            phoneNumber: (HelperService.CheckExistData(UR.phoneNumber) && UR.phoneNumber.length !== 0) ? UR.phoneNumber : '(None)',
                            suburb: (HelperService.CheckExistData(UR.suburb) && UR.suburb.length !== 0) ? UR.suburb : '(None)',
                            DOB: (HelperService.CheckExistData(UR.DOB) && UR.DOB.length !== 0) ? UR.DOB : '(None)',
                            GPReferral: GPReferral,
                            serviceType: serviceType,
                            specialist: UR.specialist,
                            specialistType: (HelperService.CheckExistData(UR.specialistType) && UR.specialistType.length !== 0) ? UR.specialistType : '(None)',
                            treatment: UR.treatment,
                            treatmentType: treatmentType,
                            description: (HelperService.CheckExistData(UR.description) && UR.description.length !== 0) ? UR.description : '(None)',
                            companyName: (HelperService.CheckExistData(UR.companyName) && UR.companyName.length !== 0) ? UR.companyName : '(None)',
                            contactPerson: (HelperService.CheckExistData(UR.contactPerson) && UR.contactPerson.length !== 0) ? UR.contactPerson : '(None)',
                            companyPhoneNumber: (HelperService.CheckExistData(UR.companyPhoneNumber) && UR.companyPhoneNumber.length !== 0) ? UR.companyPhoneNumber : '(None)',
                            bcc: 'meditekcompany@gmail.com, pnguyen@redimed.com.au'
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
                                            startTime: dataMQ.startTime,
                                            enable: 'Y'
                                        })
                                        .exec(function(err, MQCreated) {
                                            if (err) {
                                                console.log(err);
                                                return fn(err);
                                            } else {
                                                UrgentRequest.update({
                                                        tried: UR.tried,
                                                        UID: UR.UID
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
