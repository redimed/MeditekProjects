module.exports={
	jobLifeCycle:function(jobdata,FuncNonLoop,FuncLoop)
	{
        console.log("jobLifeCycle |||||||||||||||||||||||||||||||||||");
		var error=new Error("jobLifeCycle.Error");
		return QueueJobService.GetQueueJob(jobdata.ID)
		.then(function(queueJob){
			if(queueJob)
			{
				if(['READY','DELAY'].indexOf(queueJob.Status)>=0)
                {   
                    if (queueJob.Enable === 'N') {
                        error.pushError("sender.turnoffmessage");
                        return QueueJobService.BuryQueueJob(queueJob,ErrorWrap(error))
                            .then(function(success){
                                return {status:'bury'};
                        });
                    };
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
	},

    jobgLifeCycle:function(jobgdata,FuncNonLoop,FuncLoop)
    {
        console.log("jobgLifeCycle |||||||||||||||||||||||");
        var error=new Error("jobgLifeCycle.Error");
        return QueueJobgService.GetQueueJobg(jobgdata.ID)
        .then(function(queueJobg){
            if(queueJobg)
            {
                if(['READY','DELAY'].indexOf(queueJobg.Status)>=0)
                {
                    if (queueJobg.Enable === 'N') {
                        error.pushError("sender.turnoffmessage");
                        return QueueJobgService.BuryQueueJobg(queueJobg,ErrorWrap(error))
                            .then(function(success){
                                return {status:'bury'};
                        });
                    };
                    if(queueJobg.MaxRelease==0)
                    {
                        //TRUONG HOP CHI GUI MESSAGE 1 LAN
                        return FuncNonLoop(queueJobg)
                        .then(function(status){
                            return {status:"success"};
                        },function(err){
                            return QueueJobgService.BuryQueueJobg(queueJobg,ErrorWrap(err))
                            .then(function(success){
                                return {status:'bury'};
                            })
                        })
                    }
                    else
                    {
                        var ReleaseCount=queueJobg.ReleaseCount?queueJobg.ReleaseCount:0;
                        if(queueJobg.MaxRelease>=ReleaseCount)
                        {
                            //TRUONG HOP GUI MESSAGE REPEAT
                            return FuncLoop(queueJobg)
                            .then(function(status){
                                return {status:"release",ReleaseDelay:queueJobg.ReleaseDelay};
                            },function(err){
                                return QueueJobgService.BuryQueueJobg(queueJobg,ErrorWrap(err))
                                .then(function(success){
                                    return {status:'bury'};
                                })
                            })
                        }
                        else
                        {
                            error.pushError('queueJobg.MaxRelease');
                            return QueueJobgService.BuryQueueJobg(queueJobg,ErrorWrap(error))
                            .then(function(success){
                                return {status:'bury'};
                            })
                        }
                    }
                }
                else if(queueJobg.Status=="HANDLED")
                {
                    return QueueJobgService.FinishQueueJobg(queueJobg)
                    .then(function(success){
                        return {status:'success'};
                    })
                }
                else
                {
                    error.pushError("queueJobg.buried");
                    return QueueJobgService.BuryQueueJobg(queueJobg,ErrorWrap(error))
                    .then(function(success){
                        return {status:'bury'};
                    })
                }
            }
            else
            {
                error.pushError("queueJobg.notFound");
                return QueueJobgService.BuryQueueJobg(jobgdata.ID,ErrorWrap(error))
                .then(function(success){
                    return {status:'bury'};
                })
            }
        },function(err){
            return QueueJobgService.BuryQueueJobg(jobgdata.ID,ErrorWrap(err))
            .then(function(success){
                return {status:'bury'};
            })
        })
    }
}
