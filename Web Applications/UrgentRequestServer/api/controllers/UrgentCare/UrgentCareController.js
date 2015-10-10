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
                DOB: (!_.isUndefined(data.DOB) && !_.isNull(data.DOB) && !_.isEmpty(data.DOB)) ? data.DOB : null,
                suburb: data.suburb,
                IP: data.ip,
                requestDate: data.requestDate,
                serviceType: data.serviceType,
                GPReferal: data.GPReferal,
                urgentRequestType: data.urgentRequestType,
                companyName: data.companyName,
                companyPhoneNumber: data.companyPhoneNumber,
                contactPerson: data.contactPerson,
                tried: 1,
                status: 'pending',
                interval: 5,
                description: data.description,
                enable: 1
            })
            .then(function(URCreated) {
                var subjectEmail = '[Testing] - [' + data.urgentRequestType + '] - [' + Services.moment(data.requestDate).format('DD/MM/YYYY HH:mm:ss') +
                    '] - [' + data.lastName + ' ' +
                    data.firstName + '] - [' + data.phoneNumber + ']';
                var emailInfo = {
                    from: 'Redimed UrgentCare <HealthScreenings@redimed.com.au>',
                    email: 'HealthScreenings@redimed.com.au',
                    subject: subjectEmail,
                    confirmed: APIService.UrgentCareConfirmURL + '/' + data.UID,
                    urgentRequestType: data.urgentRequestType || '',
                    patientName: data.lastName + ' ' + data.firstName,
                    requestDate: Services.moment(data.requestDate).format('DD/MM/YYYY HH:mm:ss'),
                    phoneNumber: data.phoneNumber,
                    companyName: data.companyName,
                    contactPerson: data.contactPerson,
                    companyPhoneNumber: data.companyPhoneNumber,
                    bcc: 'pnguyen@redimed.com.au, thanh1101681@gmail.com'
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
                        if (!_.isUndefined(data.email) &&
                            !_.isNull(data.email) &&
                            data.email.length !== 0) {
                            var CallBackSendMailPatient = function(err, responseStatus, html, text) {
                                if (err) {
                                    console.log(err);
                                }
                            };
                            //send email and sms to customer
                            //convert service type and gp referral
                            var serviceType = '',
                                GPReferal = '';

                            switch (data.serviceType) {
                                case 'PHY':
                                    serviceType = 'Physiotherapy';
                                    break;
                                case 'SPE':
                                    serviceType = 'Specialist';
                                    break;
                                case 'HAN':
                                    serviceType = 'Hand Therapy';
                                    break;
                                case 'GP':
                                    serviceType = 'GP';
                                    break;
                                default:
                                    serviceType = '';
                                    break;
                            };
                            switch (data.GPReferal) {
                                case 'Y':
                                    GPReferal = 'Yes';
                                    break;
                                case 'N':
                                    GPReferal = 'No';
                                    break;
                                default:
                                    GPReferal = '';
                                    break;
                            };

                            var emailInfoPatient = {
                                from: 'Health Screenings <HealthScreenings@redimed.com.au>',
                                email: data.email.toLowerCase(),
                                subject: 'Request Received',
                                urgentRequestType: data.urgentRequestType || '',
                                patientName: data.lastName + ' ' + data.firstName,
                                requestDate: Services.moment(data.requestDate).format('DD/MM/YYYY HH:mm:ss'),
                                phoneNumber: data.phoneNumber,
                                suburb: (!_.isUndefined(data.suburb) && !_.isNull(data.suburb) && !_.isEmpty(data.suburb)) ? data.suburb : '',
                                DOB: (!_.isUndefined(data.DOB) && !_.isNull(data.DOB) && !_.isEmpty(data.DOB)) ? data.DOB : '',
                                requestDate: data.requestDate,
                                GPReferal: GPReferal,
                                serviceType: serviceType,
                                description: (!_.isUndefined(data.description) && !_.isNull(data.description) && !_.isEmpty(data.description)) ? data.description : '',
                                companyName: (!_.isUndefined(data.companyName) && !_.isNull(data.companyName) && !_.isEmpty(data.companyName)) ? data.companyName : '',
                                contactPerson: (!_.isUndefined(data.contactPerson) && !_.isNull(data.contactPerson) && !_.isEmpty(data.contactPerson)) ? data.contactPerson : '',
                                companyPhoneNumber: (!_.isUndefined(data.companyPhoneNumber) && !_.isNull(data.companyPhoneNumber) && !_.isEmpty(data.companyPhoneNumber)) ? data.companyPhoneNumber : '',
                            };
                            if (data.urgentRequestType === 'WorkInjury') {
                                SendMailService.SendMail('WorkInjuryReceive', emailInfoPatient, CallBackSendMailPatient);
                            } else {
                                SendMailService.SendMail('UrgentReceive', emailInfoPatient, CallBackSendMailPatient);
                            }
                        }
                        //send sms
                        var dataSMS = {
                            phone: data.phoneNumber,
                            content: 'Hi ' + data.firstName + ' ' + data.lastName + ', \nPlease note that your request has been received. ' + 'Someone from our REDIMED team will contact you shortly.' + '\nThank you for request.'

                        };
                        var CallBackSendSMS = function(err) {
                            if (err) {
                                console.log('Send SMS:' + err);
                            }
                        }
                        SendSMSService.Send(dataSMS, CallBackSendSMS);
                    }

                };

                //send email
                if (data.urgentRequestType === 'WorkInjury') {
                    SendMailService.SendMail('WorkInjuryRequest', emailInfo, CallBackSendMail);
                } else {
                    SendMailService.SendMail('UrgentRequest', emailInfo, CallBackSendMail);
                }

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
                    status: 'queueing',
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
                    status: 'queueing',
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
    },
    /*
    GetPostCode: get list post code with latitude, longitude and radius 2km
    input: latitude, longtitude
    output: list post code with  received condition
     */
    GetPostCode: function(req, res) {
        var latitude = req.params.lat;
        var longitude = req.params.long;
        var radius = 5;
        PostCode.query('SELECT * FROM PostCode WHERE POWER(Lat - ?, 2) + POWER(Lon - ?,2) <= ?*?', [latitude, longitude, radius, radius], function(err, postcode) {
            if (err) {
                console.log(err);
                res.json(500, {
                    status: 500
                });
            } else {
                res.json(400, {
                    data: postcode
                });
            }
        });
    },

    /*
    GetSuburb: get all list suburb
    input: 
    output: list suburb
    */
    GetSuburb: function(req, res) {
        PostCode.find({
                select: ['Suburb']
            })
            .sort({
                Suburb: 'ASC'
            })
            .exec(function(err, suburbs) {
                if (err) {
                    console.log(err);
                    res.json(500, {
                        status: 500
                    });
                } else {
                    //distinct suburb and parse array object to array string
                    var uniqueSuburb = _.map(_.groupBy(suburbs, function(sub) {
                        return sub.Suburb;
                    }), function(subGrouped) {
                        return subGrouped[0].Suburb;
                    });
                    res.json(200, {
                        data: uniqueSuburb
                    });
                }
            })
    }
};
