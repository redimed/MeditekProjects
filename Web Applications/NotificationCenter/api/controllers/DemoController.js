/**
 * DemoController
 *
 * @description :: Server-side logic for managing Demoes
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
	Test1:function(req,res)
	{
		console.log(sails.config.mq);
		QueueJob.create({Receiver:'demone'})
		.then(function(result){
			res.ok(result);
		},function(err){
			res.serverError(err);
		});
	}
};

