var regexp = require('node-regexp');
var $q = require('q');
module.exports = {
	Test:function(req,res)
	{
		res.json({status:"OK"})
	},
	
	createUser:function(req,res){
		var userInfo={
			UserName:req.body.UserName,
			Email:req.body.Email,
			PhoneNumber:req.body.PhoneNumber,
			Password:req.body.Password,
			Activated:'Y',
			Enable:'Y'
		}
		userInfo.UID=UUIDService.Create();
		
		//Cách 1: Managed transaction (auto-callback)
		/*sequelize.transaction(function (t) {
			return UserAccountService.CreateUserAccount(userInfo)
		})
		.then(function(success){
			res.ok(success);
		})
		.catch(function(err){
			res.serverError({message:err.message});
		})*/

		//cách 2: Unmanaged transaction (then-callback)
		sequelize.transaction().then(function(t){
			return Services.UserAccount.CreateUserAccount(userInfo,t)
			.then(function (data) {
				t.commit();
				res.ok(data);
			})
			.catch(function (err) {
				t.rollback();
				res.serverError(err);
			});
		});	

	},

	/**
	 * FindByPhoneNumber: Search user by Phone number
	 * Input: req.query.PhoneNumber
	 * Output: 
	 */
	FindByPhoneNumber:function(req,res)
	{
		var PhoneNumber=req.query.PhoneNumber;
		Services.UserAccount.FindByPhoneNumber(PhoneNumber,['UserName','Email'])
		.then(function(data){
			res.ok(data[0]);
		},function(err){
			if(err.status==404)
				res.notFound({message:err.message});
			else
				res.serverError({message:err.message});
		})
	}
}