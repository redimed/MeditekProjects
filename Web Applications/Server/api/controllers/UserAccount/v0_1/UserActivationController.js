module.exports = {
	/**
	 * Create UserActivation
	 * input: req.body: {UserAccountID,Type,VerificationCode}
	 * output: 
	 * 	if success return status 200 + UserActivateInfo
	 * 	if error return status 500 + error
	 */
	CreateUserActivation:function(req,res)
	{
		var activationInfo=req.body;
		activationInfo.CreatedBy=req.user?req.user.ID:null;
		sequelize.transaction().then(function(t){
			Services.UserActivation.CreateUserActivation(activationInfo,t)
			.then(function(data){
				t.commit();
				res.ok(data);
			},function(err){
				t.rollback();
				res.serverError(ErrorWrap(err));
			})
		})
	},

	Activation:function(req,res)
	{
		var activationInfo=req.query;
		Services.UserActivation.Activation(activationInfo)
		.then(function(data){
			res.ok(data);
		},function(err){
			res.serverError(ErrorWrap(err));
		})
	},

	/**
	 * Activation: handle request Activation User through website
	 * Input: request.query: useruid,verificationToken
	 * Output: if success return http status 200 + userInfo
	 * 			if error return http status 500 + error
	 */
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



	/**
	 * DisableUserAccount: handle request deactivation user account
	 * Input: 
	 * 	req.body: criteria to deactivation. include: req.body.ID or req.body.UserName or req.body.Email or req.body.PhoneNumber
	 * Output:
	 * 	if success return interger>0
	 * 	if error return error details
	 */
	DeactivationUserAccount:function(req,res)
	{
		var criteria=req.body;
		if(_.isEmpty(criteria))
		{
			var err=new Error('DeactivationUserAccount.Error');
			err.pushError('Request.missingParams');
			return res.badRequest(ErrorWrap(err));
		}
		sequelize.transaction().then(function(t){
			return Services.UserActivation.DeactivationUserAccount(criteria,t)
			.then(function(data){
				t.commit();
				if(data[0]>0)
					res.ok({info:data[0]});
				else
				{
					var err=new Error("DeactivationUserAccount.Error");
					err.pushError("User.notFound");
					res.notFound(ErrorWrap(err));
				}
			},function(err){
				t.rollback();
				res.serverError(ErrorWrap(err));
			});
		});
	},

	/**
	 * ActivationUserAccount: handle request activation user account
	 * Input: 
	 * 	req.body: criteria to activation. include: req.body.ID or req.body.UserName or req.body.Email or req.body.PhoneNumber
	 * Output:
	 * 	if success return interger>0
	 * 	if error return error details
	 */
	ActivationUserAccount:function(req,res)
	{
		var criteria=req.body;
		if(_.isEmpty(criteria))
		{
			var err=new Error('ActivationUserAccount.Error');
			err.pushError('Request.missingParams');
			return res.badRequest(ErrorWrap(err));
		}
		sequelize.transaction().then(function(t){
			return Services.UserActivation.ActivationUserAccount(criteria,t)
			.then(function(data){
				t.commit();
				if(data[0]>0)
					res.ok({info:data[0]});
				else
				{
					var err=new Error("ActivationUserAccount.Error");
					err.pushError("User.notFound");
					res.notFound(ErrorWrap(err));
				}
			},function(err){
				t.rollback();
				res.serverError(ErrorWrap(err));
			});
		});
	},


}