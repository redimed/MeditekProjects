var notifyHandlers=require('./handlers/NotifyHandlers');
var NotifyWorker = require('fivebeans').worker;

var options =
{
    id: 'notify_worker',
    host: '192.168.232.139',
    port: 11300,
    handlers:
    {
        sendnotify: notifyHandlers.sendnotify()
    },
    ignoreDefault: true
}
var notifyWorker = new NotifyWorker(options);
//EVENTS
notifyWorker
//Emitted on error in the underlying client. 
//Payload is the error object. 
//Execution is halted. 
//You must listen for this event.
.on('error',function(payload){
	console.log("=======FIVEBEANS NOTIFY_WORKER ERROR EVENT==========");
	console.log(payload);
})
//Emitted on close in the underlying client. No payload.
.on('close',function(){
	console.log("=======FIVEBEANS NOTIFY_WORKER CLOSE EVENT==========");
})
//Worker has started processing. No payload.
.on('started',function(){
	console.log("=======FIVEBEANS NOTIFY_WORKER STARTED EVENT==========");
})
//Worker has stopped processing. No payload.
.on('stopped',function(ev){
	console.log("=======FIVEBEANS NOTIFY_WORKER STOPPED EVENT==========");
})
//The worker has taken some action that you might want to log. 
//The payload is an object with information about the action, with two fields:
// {
//     clientid: 'id-of-worker',
//     message: 'a logging-style description of the action'
// }
.on('info',function(payload){
	console.log("=======FIVEBEANS NOTIFY_WORKER INFO EVENT==========");
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
	console.log("=======FIVEBEANS NOTIFY_WORKER WARNING EVENT==========");
	console.log(payload);
})
//The worker has reserved a job. The payload is the job id.
.on("job.reserved",function(payload){
	console.log("=======FIVEBEANS NOTIFY_WORKER JOB.RESERVED EVENT==========");
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
	console.log("=======FIVEBEANS NOTIFY_WORKER JOB.RESERVED EVENT==========");
	console.log(payload);
})
//The worker has deleted a job. The payload is the job id.
.on("job.deleted",function(payload){
	console.log("=======FIVEBEANS NOTIFY_WORKER JOB.DELETED EVENT==========");
	console.log(payload);
})
//The worker has buried a job. The payload is the job id.
.on("job.buried",function(payload){
	console.log("=======FIVEBEANS NOTIFY_WORKER JOB.BURIED EVENT==========");
	console.log(payload);
})

notifyWorker.start(['NOTIFY']);