var HandlerUtils=require("./HandlerUtils");
var sendNotifyNonLoop=function(queueJob)
{
	return NotifyService.SendNotify(queueJob.Receiver,queueJob.EventName,queueJob.MsgContent)
	.then(function(responseData){
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
};

var sendNotifyLoop=function(queueJob)
{
	return NotifyService.SendNotify(queueJob.Receiver,queueJob.EventName,queueJob.MsgContent)
	.then(function(responseData){
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
	sendnotify:function(){
		function SendNotify()
		{
			this.type='sendnotify';
			this.work=function(jobdata,callback)
			{
				console.log("|||||||||||||||||||||||||| sendnotify");
				HandlerUtils.jobLifeCycle(jobdata,sendNotifyNonLoop,sendNotifyLoop)
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
		var handler = new SendNotify();
        return handler;
	}
}