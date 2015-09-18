module.exports = {
/*
    ReceiveRequest
    input: patient's datarmation
    output: - success: send status success for patient
            - fail: send status error for patient
*/
    ReceiveRequest: function(req, res) {
        var data = req.body.data;
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
        data.UID = UUID.Create();

        //save information patient
        UrgentRequest.create({
            UID: data.UID,
            firstName: data.firstName,
            lastName: data.lastName,
            phoneNumber: data.phoneNumber,
            gender: data.gender,
            email: data.email,
            DOB: data.DOB,
            address1: data.address1,
            address2: data.address2,
            suburb: data.suburb,
            postCode: data.postCode,
            state: data.state,
            IP: data.ip,
            requestDate: data.requestDate,
            tried: 1,
            confirmed: 0,
            interval: 5,
            description: data.description
        })
        .then(function(URCreated){
             var locals = {
                email: data.email,
                subject: 'Confirm receive email',
                confirmed: 'http://localhost:3000/api/confirm/' + data.UID
            };

            /*
            CallBackSendMail: callback from function sendmail
            input: err, responseStatus, html, text
            output: theow error
            */
            var CallBackSendMail = function(err, responseStatus, html, text){
                if(err){
                    console.log(err);
                }
            };

            //send email
            SendMailService.SendMail('UrgentRequest', locals, CallBackSendMail);

            //get urgent request id
            var UrgentRequestID = UrgentRequest.findOne()
                    .where({ UID: data.UID})
                    .then(function(URID){
                        return URID;
                    });
            return [UrgentRequestID];
        })
        .spread(function(UrgentRequestID){            
            //save message  queue to database
            var dataMQ = {
                UID: UUID.Create(),
                urgentRequestID: UrgentRequestID.ID,
                source: 'Urgent Request',
                sourceID: 1,
                job: 'Receive email urgent request',
                status: 'spending',
                startTime: new Date()
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
            .exec(function(err, MQCreated){
                if(err) res.json(500, {error: err});
                else {
                //created and start message queue
                Services.MessageQueue.Create(data.UID, dataMQ.UID);
                    res.json(200, {data: 'success'});
                }  
            });
        })
        .catch(function(err){
            res.json(500, {error: err});
        });
    },

    /*
    ConfirmRequest: confirmation receive email
    input: UID urgent request
    output: status confirmed
    */
    ConfirmRequest: function(req, res){
        UrgentRequest.update({confirmed: 0}, {confirmed: 1})
        .exec(function(err, URUpdated){
            if(err) res.json(200, {error: err});
            else {
                res.json('Request confirmed!');
            }
        });
    }
};
