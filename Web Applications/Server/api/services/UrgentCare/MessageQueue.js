module.exports = {
	/*
	Create: Create message queue, check confirm, tried send mail
	input: UIDUR - urgent request UID, UIDMQ - message queue UID
	output: resend 3rd email if send failed
	*/
	Create: function(UIDUR, UIDMQ){
		setTimeout(function(){
			//update status completed for message queue
			MessageQueue.update({status: 'spending',completedTime: null},{status: 'completed', completedTime: new Date()})
			.where({UID: UIDMQ})
			.then(function(MQUpdated){
				var UR = UrgentRequest.findOne()
							.where({UID: UIDUR})
							.then(function(UR){
								return UR;
							});
				return [UR];
			})
			.spread(function(UR){
				//check tried and confirmed urgent request
				if(UR.tried < 3 && UR.confirmed === 0){
					var locals = {
			                email: UR.email,
			                subject: 'Resend confirm',
			                confirmed: 'http://localhost:3000/api/confirm/' + UR.UID
			            };
		            var CallBackSendMail = function(err, responseStatus, html, text){
		                if(err){
		                    console.log(err);
		                }
		            }
		            //send mail
            		SendMailService.SendMail('UrgentRequest', locals, CallBackSendMail);

		    		//create message queue
					UrgentRequest.findOne()
					.where({UID: UIDUR})
					.exec(function(err, urgentRequest){
						if(err) throw new Error(err);
						else {
							var dataMQ = {
				                UID: UUID.Create(),
				                urgentRequestID: urgentRequest.ID,
				                source: 'Urgent Request',
				                sourceID: 1,
				                job: 'Receive email urgent request',
				                status: 'spending',
				                startTime: new Date()
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
							.exec(function(err, MQCreated){
								if(err) throw new Error(err);
								else {
									UrgentRequest.update({tried: UR.tried}, {tried: UR.tried + 1})
									.exec(function(URUpdated){
										//recursive this function
										module.exports.Create(UIDUR, dataMQ.UID);
									});
								}
							});
						}
					});
						}
					})
					.catch(function(err){
						throw new Error(err);
					});
		},Services.MessageQueue.GetMSecond(5));
	},
	GetMSecond: function(Minute){
		return (Minute*60*1000);
	}
};
