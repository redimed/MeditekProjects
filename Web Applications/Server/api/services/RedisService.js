var redis=require("./RedisWrap");
var o=require("./HelperService");

var userConnectKeyPrefix="userConnect:";
var concatp=function()
{
	var str="";
	for (var i = 0; i < arguments.length; i++) 
	{
		if(o.checkData(arguments[i]))
		{
			str=str+arguments[i]+':';
		}
	}
	str=str.substring(0,str.length-1);
	return str;
}

module.exports={
	pushUserConnect:function(connectInfo)
	{
		var key=userConnectKeyPrefix+connectInfo.UserUID;
		var hashKey=concatp(connectInfo.SystemType,connectInfo.DeviceID,connectInfo.AppID);
		return redis.hget(key,hashKey)
		.then(function(obj){
			if(obj && obj.sid)
			{
				if(connectInfo.sid!=obj.sid)
					redis.del('sess:'+obj.sid);
				return "next";
			}
		},function(err){
			throw err;
		})
		.then(function(data){
			redis.hset(key,hashKey,connectInfo);
			console.log("pushUserConnect:",key,hashKey,connectInfo);
			return {status:'success'};
		},function(err){
			throw err;
		})
	},

	removeUserConnect:function(connectInfo)
	{
		var key=userConnectKeyPrefix+connectInfo.UserUID;
		var hashKey=concatp(connectInfo.SystemType,connectInfo.DeviceID,connectInfo.AppID);
		return redis.hdel(key,hashKey)
		.then(function(success){
			return success;
		},function(err){
			throw err;
		})
	},

	getUserConnects:function(uid,connectInfo)
	{
		var key=userConnectKeyPrefix+uid;
		return redis.hkeysvals(key)
		.then(function(vals){
			console.log(vals);
		})
	}
}