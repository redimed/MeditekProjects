var globalNotifyHandlers=require('./handlers/GlobalNotifyHandlers');
var GlobalNotifyWorker = require('fivebeans').worker;
var config=sails.config.myconf;
var options =
{
    id: 'global_notify_worker',
    host: config.beanstalkd.host,
    port: config.beanstalkd.port,
    handlers:
    {
        sendglobalnotify: globalNotifyHandlers.sendglobalnotify()
    },
    ignoreDefault: true
}
var globalNotifyWorker = new GlobalNotifyWorker(options);
//EVENTS
globalNotifyWorker
//Emitted on error in the underlying client. 
//Payload is the error object. 
//Execution is halted. 
//You must listen for this event.
.on('error',function(payload){
	console.log("=======FIVEBEANS GLOBAL_NOTIFY_WORKER ERROR EVENT==========");
	console.log(payload);
})
//Emitted on close in the underlying client. No payload.
.on('close',function(){
	console.log("=======FIVEBEANS GLOBAL_NOTIFY_WORKERGLOBAL_NOTIFY_WORKER CLOSE EVENT==========");
})
//Worker has started processing. No payload.
.on('started',function(){
	console.log("=======FIVEBEANS GLOBAL_NOTIFY_WORKER STARTED EVENT==========");
})
//Worker has stopped processing. No payload.
.on('stopped',function(ev){
	console.log("=======FIVEBEANS GLOBAL_NOTIFY_WORKER STOPPED EVENT==========");
})
//The worker has taken some action that you might want to log. 
//The payload is an object with information about the action, with two fields:
// {
//     clientid: 'id-of-worker',
//     message: 'a logging-style description of the action'
// }
.on('info',function(payload){
	console.log("=======FIVEBEANS GLOBAL_NOTIFY_WORKER INFO EVENT==========");
	console.log(payload);
})
// The worker has encountered an error condition that will not stop processing, 
// but that you might wish to act upon or log. 
// The payload is an object with information about the error. 
// Fields guaranteed to be present are:
// {
//     clientid: 'id-of-worker',
//     message: 'the context of the error',
//     error: errorObject
// }
.on('warning',function(payload){
	console.log("=======FIVEBEANS GLOBAL_NOTIFY_WORKER WARNING EVENT==========");
	console.log(payload);
})
//The worker has reserved a job. The payload is the job id.
.on("job.reserved",function(payload){
	console.log("=======FIVEBEANS GLOBAL_NOTIFY_WORKER JOB.RESERVED EVENT==========");
	console.log(payload);
})
// The worker has completed processing a job. The payload is an object with information about the job.
// {
//     id: job id,
//     type: job type,
//     elapsed: elapsed time in ms,
//     action: [ 'success' | 'release' | 'bury' | custom error message ]
// }
.on("job.handled",function(payload){
	console.log("=======FIVEBEANS GLOBAL_NOTIFY_WORKER JOB.RESERVED EVENT==========");
	console.log(payload);
})
//The worker has deleted a job. The payload is the job id.
.on("job.deleted",function(payload){
	console.log("=======FIVEBEANS GLOBAL_NOTIFY_WORKER JOB.DELETED EVENT==========");
	console.log(payload);
})
//The worker has buried a job. The payload is the job id.
.on("job.buried",function(payload){
	console.log("=======FIVEBEANS GLOBAL_NOTIFY_WORKER JOB.BURIED EVENT==========");
	console.log(payload);
})

globalNotifyWorker.start(['GLOBALNOTIFY']);