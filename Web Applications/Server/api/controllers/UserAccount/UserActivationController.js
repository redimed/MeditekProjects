module.exports = {
	/**
	 * Create UserActivation
	 */
	CreateUserActivation:function(req,res)
	{
		var activationInfo=req.body;
		sequelize.transaction().then(function(t){
			Services.UserActivation.CreateUserActivation(activationInfo,t)
			.then(function(data){
				t.commit();
				res.ok(data);
			},function(err){
				t.rollback();
				console.log(err);
				res.serverError(ErrorWrap(err));
			})
		})
	},

	ActivationWeb:function(req,res){
		var useruid=req.query.useruid;
		var verificationToken=req.query.verificationToken;
		sequelize.transaction().then(function(t){
			Services.UserActivation.ActivationWeb({useruid:useruid,verificationToken:verificationToken},t)
			.then(function(data){
				t.commit();
				res.ok(data);
			},function(err){
				t.rollback();
				res.serverError(ErrorWrap(err));
			})
		});
		
	},
}