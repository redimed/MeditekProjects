/**
 * @namespace BeansService
 * @memberOf Service
 * @description Service for beanstalkd
 */

var $q=require('q');
var fivebeans=require('fivebeans');
var config=sails.config.myconf;

var client = new fivebeans.client(config.beanstalkd.host, config.beanstalkd.port);
client
    .on('connect', function()
    {
    	console.log("=================BEANSTALKD CONNECT=================");
        // client can now be used
    })
    .on('error', function(err)
    {
    	console.log("=================BEANSTALKD ERROR=================");
        // connection failure
    })
    .on('close', function()
    {
    	console.log("=================BEANSTALKD CLOSE=================");
        // underlying connection has closed
    })
    .connect();

var mqlog=function()
{
	console.log("=================FileBeansLog Begin==================");
	for (var i = 0; i < arguments.length; i++) {
		if(arguments[i] instanceof Error)
		{
			console.log("Error: ",arguments[i]);
		}                                                                                                                  
		else
		{
			console.log(arguments[i]);
		}
    }
	console.log("=================FileBeansLog End==================");
};
module.exports={
	/**
	 * @typedef {object} putJobException
	 * @memberOf Service.BeansService
	 * @property {string} ErrorType "putJob.Error";
	 * @property {Array.<string|object>} ErrorsList Chỉ sử dụng ErrorsList[0] </br>
	 * - putcmd.error </br>
	 * - usecmd.error </br>
	 */

	/**
	 * @function putWork
	 * @memberOf Service.BeansService
	 * @summary Đưa một job vào một tube xác định
	 * @param {string} tube Tên tube
	 * @param {Number} priority Độ ưu tiên thực hiện
	 * @param {Number} delay Job sẽ ở trạng thái delay trong bao lâu trước khi có thể được reserve
	 * @param {Number} ttr Thời gian tối đa để thực hiện job, nếu quá thời gian này job sẽ được quay về tube
	 * Mặc định của beanstalkd là 120 giây.
	 * @param {object|string} payload data
	 * @return {object} promise trả về {tubename:val,jobid:val}
	 * @throw {Service.BeansService.putJobException}
	 */
	putJob:function(tube,priority,delay,ttr,payload)
	{
		var q=$q.defer();
		var error=new Error("putJob.Error");
		try
		{
			client.use(tube,function(err,tubename){
				if(err)
				{
					error.pushError("usecmd.error");
					mqlog(err);
					throw error;
				}
				else
				{
					mqlog("usecmd.result: tubename: ",tubename);
					client.put(priority,delay,ttr,payload,function(err,jobid){
						if(err)
						{
							error.pushError('putcmd.error');
							mqlog(err);
							throw error;
						}
						else
						{
							mqlog("usercomd.result: jobid: ",jobid);
							console.log({tubename:tubename,jobid:jobid});
							q.resolve({tubename:tubename,jobid:jobid});
						}
					})
				}	
			})
		}
		catch(err)
		{
			q.reject(err);
		}		
		return q.promise;
	}
}