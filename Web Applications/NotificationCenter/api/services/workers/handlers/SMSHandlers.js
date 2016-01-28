var HandlerUtils=require("./HandlerUtils");

var sendSMSNonLoop=function(queueJob)
{
	return SMSService.SendSMS(queueJob.Receiver,queueJob.MsgContent)
	.then(function(responseData){
		console.log(responseData);
		return QueueJobService.FinishQueueJob(queueJob)
		.then(function(qj){
			return {status:'success'};
		},function(err){
			throw err;
		})
	},function(err){
		console.log(err);
		throw err;
	})
}

var sendSMSLoop=function(queueJob)
{
	return SMSService.SendSMS(queueJob.Receiver,queueJob.MsgContent)
	.then(function(responseData){
		console.log(responseData);
		return QueueJobService.Requeue(queueJob)
		.then(function(qj){
			return {status:'release'}
		},function(err){
			throw err;
		})
	},function(err){
		console.log(err);
		throw err;
	})
}

module.exports={
	sendsms:function()
	{
		function SendSMS()
		{
			this.type='sendsms';
			this.work=function(jobdata,callback)
			{
				HandlerUtils.jobLifeCycle(jobdata,sendSMSNonLoop,sendSMSLoop)
                .then(function(result){
                    if(result.status=='success')
                    {
                        callback("success");
                    }
                    else if(result.status=='release')
                    {
                        callback("release",result.ReleaseDelay);
                    }
                    else
                    {
                        callback("bury");
                    }
                })
			}
		}
		var handler = new SendSMS();
        return handler;
	}
}