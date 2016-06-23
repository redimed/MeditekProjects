module.exports={
	jobLifeCycle:function(jobdata,FuncNonLoop,FuncLoop)
	{
		var error=new Error("jobLifeCycle.Error");
		return QueueJobService.GetQueueJob(jobdata.ID)
		.then(function(queueJob){
			if(queueJob)
			{
				if(['READY','DELAY'].indexOf(queueJob.Status)>=0)
                {
                	if(queueJob.MaxRelease==0)
                    {
                        //TRUONG HOP CHI GUI MESSAGE 1 LAN
                    	return FuncNonLoop(queueJob)
                        .then(function(status){
                            return {status:"success"};
                        },function(err){
                            return QueueJobService.BuryQueueJob(queueJob,ErrorWrap(err))
                            .then(function(success){
                                return {status:'bury'};
                            })
                        })
                    }
                    else
                    {
                        var ReleaseCount=queueJob.ReleaseCount?queueJob.ReleaseCount:0;
                        if(queueJob.MaxRelease>=ReleaseCount)
                        {
                            //TRUONG HOP GUI MESSAGE REPEAT
                            return FuncLoop(queueJob)
                            .then(function(status){
                                return {status:"release",ReleaseDelay:queueJob.ReleaseDelay};
                            },function(err){
                                return QueueJobService.BuryQueueJob(queueJob,ErrorWrap(err))
                                .then(function(success){
                                    return {status:'bury'};
                                })
                            })
                        }
                        else
                        {
                            error.pushError('queueJob.MaxRelease');
                            return QueueJobService.BuryQueueJob(queueJob,ErrorWrap(error))
                            .then(function(success){
                            	return {status:'bury'};
                            })
                        }
                    }
                }
                else if(queueJob.Status=="HANDLED")
                {
                	return QueueJobService.FinishQueueJob(queueJob)
                    .then(function(success){
                        return {status:'success'};
                    })
                }
                else
                {
                	error.pushError("queueJob.buried");
                    return QueueJobService.BuryQueueJob(queueJob,ErrorWrap(error))
                    .then(function(success){
                        return {status:'bury'};
                    })
                }
			}
			else
			{
				error.pushError("queueJob.notFound");
                return QueueJobService.BuryQueueJob(jobdata.ID,ErrorWrap(error))
                .then(function(success){
                    return {status:'bury'};
                })
			}
		},function(err){
			return QueueJobService.BuryQueueJob(jobdata.ID,ErrorWrap(err))
            .then(function(success){
                return {status:'bury'};
            })
		})
	}
}
