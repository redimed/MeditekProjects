module.exports={
	CreateEmailJob:function(req,res)
	{
		var body=req.body;
		QueueJobService.CreateQueueJob(body)
		.then(function(data){
			// res.ok(data);
			var job={
				type:'sendmail',
				payload:data.dataValues
			}
			BeansService.putJob('EMAIL',0,0,20,JSON.stringify(job))
			.then(function(result){
				console.log(result);
				res.ok(result);
			},function(err){
				res.serverError(ErrorWrap(err));
			})

		},function(err){
			res.serverError(ErrorWrap(err));
		})
		
	},

	CreateSMSJob:function(req,res)
	{
		var body=req.body;
		QueueJobService.CreateQueueJob(body)
		.then(function(data){
			// res.ok(data);
			var job={
				type:'sendsms',
				payload:data.dataValues
			}
			BeansService.putJob('SMS',0,0,20,JSON.stringify(job))
			.then(function(result){
				console.log(result);
				res.ok(result);
			},function(err){
				res.serverError(ErrorWrap(err));
			})

		},function(err){
			res.serverError(ErrorWrap(err));
		})

	},

	CreateNotifyJob:function(req,res)
	{
		var body=req.body;
		QueueJobService.CreateQueueJob(body)
		.then(function(data){
			// res.ok(data);
			var job={
				type:'sendnotify',
				payload:data.dataValues
			}
			BeansService.putJob('NOTIFY',0,0,20,JSON.stringify(job))
			.then(function(result){
				console.log(result);
				res.ok(result);
			},function(err){
				res.serverError(ErrorWrap(err));
			})

		},function(err){
			res.serverError(ErrorWrap(err));
		})
	},

	FinishQueueJob:function(req,res)
	{
		var queueJobID=req.body.queueJobID;
		QueueJobService.FinishQueueJob(queueJobID)
		.then(function(qj){
			res.ok({status:'success'});
		},function(err){
			res.serverError(ErrorWrap(err));
		})
	},

	BuryQueueJob:function(req,res)
	{
		var queueJobID=req.body.queueJobID;
		var log=req.body.log;
		QueueJobService.BuryQueueJob(queueJobID,log)
		.then(function(qj){
			res.ok({status:'success'});
		},function(err){
			res.serverError(ErrorWrap(err));
		})
	}
}