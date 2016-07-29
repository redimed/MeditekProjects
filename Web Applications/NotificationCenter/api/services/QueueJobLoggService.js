module.exports={
	AddLog:function(queueJobgID,log)
	{
		QueueJobLogg.create({
			QueueJobgID:queueJobgID,
			Log:JSON.stringify(log),
			CreatedDate:new Date()
		})
		.then(function(queueJobLog){
			
		},function(err){
			console.log(err);
		})
	}
}