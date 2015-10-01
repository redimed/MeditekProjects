module.exports = {
	/**
	 * Create UserActivation
	 * @param {[type]} req [description]
	 * @param {[type]} res [description]
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
				res.serverError(ErrorWrap(err));
			})
			// .catch(function(err){
				
			// })
		})
		
	}
}