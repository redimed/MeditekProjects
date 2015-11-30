var redis=require("redis");
var client = redis.createClient();
client.on("error", function (err) {
    console.log("uh oh", err);
});
var $q=require('q');
module.exports={
	set:client.set,
	hset:client.hset,
	

};