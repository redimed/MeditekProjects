module.exports={
	CreateQueueJob:function(req,res)
	{
		var body=req.body;
		QueueJobService.CreateQueueJob(body)
		.then(function(data){
			// res.ok(data);
			var job={
				type:'sendmail',
				payload:data.dataValues
			}
			BeansService.putJob('EMAIL',1,1,20,JSON.stringify(job))
			.then(function(result){
				console.log(result);
				res.ok(result);
			},function(err){
				res.serverError(err);
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
			BeansService.putJob('SMS',1,1,20,JSON.stringify(job))
			.then(function(result){
				console.log(result);
				res.ok(result);
			},function(err){
				res.serverError(err);
			})

		},function(err){
			res.serverError(ErrorWrap(err));
		})

	}
}