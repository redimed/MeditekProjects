var HandlerUtils=require("./HandlerUtils");
var sendGlobalNotifyNonLoop=function(queueJobg)
{
	return GlobalNotifyService.SendGlobalNotify(queueJobg.Receiver,queueJobg.EventName,queueJobg.MsgContent)
	.then(function(responseData){
		return QueueJobgService.FinishQueueJobg(queueJobg)
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

var sendGlobalNotifyLoop=function(queueJobg)
{
	return GlobalNotifyService.SendGlobalNotify(queueJobg.Receiver,queueJobg.EventName,queueJobg.MsgContent)
	.then(function(responseData){
		return QueueJobgService.Requeue(queueJobg)
		.then(function(qj){
			return {status:'release'}
		},function(err){
			throw err;
		})
	},function(err){
		console.log(err);
		throw err;
	})
};

module.exports={
	sendglobalnotify:function(){
		function SendGlobalNotify()
		{
			console.log("||||||||||||||||||||||||||||| sendglobalnotify");
			this.type='sendglobalnotify';
			this.work=function(jobgdata,callback)
			{
				HandlerUtils.jobgLifeCycle(jobgdata,sendGlobalNotifyNonLoop,sendGlobalNotifyLoop)
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
		var handler = new SendGlobalNotify();
        return handler;
	}
}