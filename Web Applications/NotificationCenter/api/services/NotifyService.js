var $q=require("q");
module.exports={
	SendNotify:function(roomName,eventName,msgData,socketToOmit)
	{
		var q=$q.defer();
		try{
			sails.sockets.broadcast(roomName,eventName,msgData,socketToOmit);
			q.resolve({status:'success'});
		}
		catch(e)
		{
			q.reject(e);
		}
		return q.promise;
	}
}