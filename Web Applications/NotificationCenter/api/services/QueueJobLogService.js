module.exports={
	AddLog:function(queueJobID,log)
	{
		QueueJobLog.create({
			QueueJobID:queueJobID,
			Log:JSON.stringify(log),
			CreatedDate:new Date()
		})
		.then(function(queueJobLog){
			
		},function(err){
			console.log(err);
		})
	}
}