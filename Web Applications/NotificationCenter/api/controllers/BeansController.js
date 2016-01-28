module.exports={
	putJob:function(req,res)
	{
		var job={
			type:'emitkeys',
			payload:'tannguyen'
		}
		BeansService.putJob('gp',1,1,2,JSON.stringify(job))
		.then(function(data){
			console.log(data);
			res.ok(data);
		},function(err){
			res.serverError(err);
		})
	},
}