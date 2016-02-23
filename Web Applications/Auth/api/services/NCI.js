var socketIOClient= require('socket.io-client');
var sailsIOClient=require('sails.io.js');
var io=sailsIOClient(socketIOClient);
var $q=require('q');

module.exports=function(url)
{
	io.sails.url=url;
	var obj={
		pushNotify:function(body)
		{
			var q=$q.defer();
			try{
				io.socket.post('/CreateNotifyJob',body,function(resData,jwres){
					q.resolve({resData:resData,jwres:jwres});
				})
			}
			catch(e){
				q.reject(e);
			}
			return q.promise;
		},

		pushEmail:function(body)
		{
			var q=$q.defer();
			try{
				io.socket.post('/CreateEmailJob',body,function(resData,jwres){
					q.resolve({resData:resData,jwres:jwres});
				})
			}
			catch(e){
				q.reject(e);
			}
			return q.promise;
		},

		pushSMS:function(body)
		{
			var q=$q.defer();
			try{
				io.socket.post('/CreateSMSJob',body,function(resData,jwres){
					q.resolve({resData:resData,jwres:jwres});
				})
			}
			catch(e){
				q.reject(e);
			}
			return q.promise;
		},

		pushFinishJob:function(queueJobID)
		{
			var q=$q.defer();
			try{
				io.socket.post('/FinishQueueJob',{queueJobID:queueJobID},function(resData,jwres){
					q.resolve({resData:resData,jwres:jwres});
				})
			}	
			catch(e){
				q.reject(e);
			}
			return q.promise;
		},

		pushBuryJob:function(queueJobID,log)
		{
			var q=$q.defer();
			try{
				io.socket.post('/BuryQueueJob',{queueJobID:queueJobID,log:log},function(resData,jwres){
					q.resolve({resData:resData,jwres:jwres});
				})
			}
			catch(e){
				q.reject(e);
			}
			return q.promise;
		},
	}
	return obj;
}