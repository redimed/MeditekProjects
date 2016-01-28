var HandlerUtils=require("./HandlerUtils");
var sendMailNonLoop=function(queueJob)
{
    var mailOptions={
        subject:queueJob.Subject,
        to:queueJob.Receiver,
        html:queueJob.MsgContent
    }
    return EmailService.SendMail('test',mailOptions)
    .then(function(sentInfo){
        console.log(sentInfo);
        return QueueJobService.FinishQueueJob(queueJob)
        .then(function(qj){
            return QueueJobService.Requeue(queueJob)
            .then(function(qj){
                return {status:"success"};
            },function(err){
                throw err;
            })
        },function(err){
            throw err;
        })
        
    })
}

var sendMailLoop=function(queueJob)
{
    var mailOptions={
        subject:queueJob.Subject,
        to:queueJob.Receiver,
        html:queueJob.MsgContent
    }
    return EmailService.SendMail('test',mailOptions)
    .then(function(sentInfo){
        console.log(sentInfo);
        return QueueJobService.Requeue(queueJob)
        .then(function(qj){
            return {status:"release"};
        },function(err){
            throw err;
        })
    },function(err){
        throw err;
    })
}

module.exports={

    sendmail:function()
    {
        function TestEmail()
        {
            this.type = 'sendmail';
            this.work=function(jobdata, callback)
            {
                HandlerUtils.jobLifeCycle(jobdata,sendMailNonLoop,sendMailLoop)
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
        var handler = new TestEmail();
        return handler;
    }
}