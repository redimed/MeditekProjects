module.exports = {
    /*
        ReceiveRequest
        input: patient's datarmation
        output: - success: send status success for patient
                - fail: send status error for patient
    */
    ReceiveRequest: function(req, res) {
        var data = req.body.data;
        if (!_.isObject(data)) {
            try {
                data = JSON.parse(data);
            } catch (err) {
                console.log(err);
                res.json(400, {
                    error: err,
                    status: 400
                });
                return;
            }
        }
        //get client's IP
        data.ip = req.headers['X-Client-IP'] ||
            req.headers['X-Forwarded-For'] ||
            req.headers['X-Real-IP'] ||
            req.headers['X-Cluster-Client-IP'] ||
            req.headers['X-Forwared'] ||
            req.headers['X-Forwared-For'] ||
            req.headers['X-Forwared'] ||
            req.connection.remoteAddress ||
            req.socket.remoteAddress ||
            req.connection.socket.remoteAddress;
        data.UID = UUIDService.Create();
        data.requestDate = Services.moment().format('YYYY-MM-DD HH:mm:ss');
        //save information patient
        UrgentRequest.create({
                UID: data.UID,
                firstName: data.firstName,
                lastName: data.lastName,
                phoneNumber: data.phoneNumber,
                gender: data.gender,
                email: data.email,
                DOB: (data.DOB === '' ? null : data.DOB),
                suburb: data.suburb,
                IP: data.ip,
                requestDate: data.requestDate,
                serviceType: data.serviceType,
                GPReferal: data.GPReferal,
                urgentRequestType: data.urgentRequestType,
                tried: 1,
                status: 'spending',
                interval: 5,
                description: data.description,
                enable: 1
            })
            .then(function(URCreated) {
                var emailInfo = {
                    from: 'Health Screenings <HealthScreenings@redimed.com.au>',
                    // email: 'HealthScreenings@redimed.com.au',
                    email: data.email,
                    subject: '[Testing] - [UrgentCare Request] - [' + Services.moment(data.requestDate).format('DD/MM/YYYY HH:mm:ss') +
                        '] - [' + data.lastName + ' ' +
                        data.firstName + '] - [' + data.phoneNumber + ']',
                    confirmed: APIService.UrgentCareConfirmURL + '/' + data.UID,
                    urgentRequestType: data.urgentRequestType,
                    patientName: data.lastName + ' ' + data.firstName,
                    requestDate: Services.moment(data.requestDate).format('DD/MM/YYYY HH:mm:ss'),
                    phoneNumber: data.phoneNumber,
                    cc: 'HealthScreenings@redimed.com.au'
                };

                /*
                CallBackSendMail: callback from function sendmail
                input: err, responseStatus, html, text
                output: throw error
                */
                var CallBackSendMail = function(err, responseStatus, html, text) {
                    if (err) {
                        console.log(err);
                    } else {
                        var CallBackSendMailPatient = function(err, responseStatus, html, text) {
                            if (err) {
                                console.log(err);
                            } else {
                                //send sms
                                var dataSMS = {
                                    phone: data.phoneNumber,
                                    content: 'Your request has been successfully Please wait for out staff to contact you'
                                };
                                var CallBackSendSMS = function(err) {
                                    console.log(err);
                                }
                                SendSMSService.Send(dataSMS, CallBackSendSMS);
                            }
                        };
                        //send email and sms to customer
                        var emailInfoPatient = {
                            from: 'Health Screenings <HealthScreenings@redimed.com.au>',
                            email: data.email,
                            subject: 'Request Received',
                            urgentRequestType: data.urgentRequestType,
                            patientName: data.lastName + ' ' + data.firstName,
                            requestDate: Services.moment(data.requestDate).format('DD/MM/YYYY HH:mm:ss'),
                            phoneNumber: data.phoneNumber,
                            cc: 'HealthScreenings@redimed.com.au'
                        };
                        SendMailService.SendMail('UrgentReceive', emailInfoPatient, CallBackSendMailPatient);
                    }
                };

                //send email
                SendMailService.SendMail('UrgentRequest', emailInfo, CallBackSendMail);

                //get urgent request id
                var UrgentRequestID = UrgentRequest.findOne()
                    .where({
                        UID: data.UID
                    })
                    .then(function(URID) {
                        return URID;
                    });
                return [UrgentRequestID];
            })
            .spread(function(UrgentRequestID) {
                //save message  queue to database
                var dataMQ = {
                    UID: UUIDService.Create(),
                    urgentRequestID: UrgentRequestID.ID,
                    source: 'Urgent Request',
                    sourceID: 1,
                    job: 'Receive email urgent request',
                    status: 'spending',
                    startTime: Services.moment().format('YYYY-MM-DD HH:mm:ss')
                };

                //save message queue to database
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
                            res.json(500, {
                                error: err,
                                status: 500
                            });
                        } else {
                            var CallBackMessageQueue = function(err) {
                                res.json(500, {
                                    error: err,
                                    status: 500
                                });
                                return;
                            };
                            //created and start message queue
                            MessageQueueService.CreateMessageQueue(data.UID, dataMQ.UID, CallBackMessageQueue);
                            res.json(200, {
                                data: 'success',
                                status: 200
                            });
                        }
                    });
            })
            .catch(function(err) {
                console.log(err);
                res.json(500, {
                    error: err,
                    status: 500
                });
            });
    },

    /*
    ConfirmRequest: confirmation receive email
    input: UID urgent request
    output: status confirmed
    */
    ConfirmRequest: function(req, res) {
        require('getmac').getMac(function(err, macaddr) {
            UrgentRequest.update({
                    status: 'spending',
                    confirmUserName: null
                }, {
                    status: 'confirmed',
                    confirmUserName: macaddr
                })
                .where({
                    UID: req.params.id
                })
                .exec(function(err, URUpdated) {
                    if (err) {
                        res.json(500, {
                            error: err,
                            status: 500
                        });
                    } else {
                        if (!_.isUndefined(URUpdated[0])) {
                            var htmlConfirmed =
                                '<table><tr><td><b>Confirmed Success</b></td></tr>' +
                                '<tr><td>UrgentCare Type: ' + (URUpdated[0].urgentRequestType === null ? '' : URUpdated[0].urgentRequestType) + '</td></tr>' +
                                '<tr><td>Patient Name: ' + URUpdated[0].lastName + ' ' + URUpdated[0].firstName + '</td></tr>' +
                                '<tr><td>Request Date: ' + URUpdated[0].requestDate + '</td></tr>' +
                                '<tr><td>Phone Number: ' + URUpdated[0].phoneNumber + '</td></tr>' +
                                '</td></tr></table>';
                            res.send(htmlConfirmed);
                        } else {
                            res.json(404, {
                                err: URUpdated
                            });
                        }
                    }
                });
        });
    }
};
