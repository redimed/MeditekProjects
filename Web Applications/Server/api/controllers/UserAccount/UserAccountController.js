var regexp = require('node-regexp');
module.exports = {
	Test:function(req,res)
	{
		var phoneNumber=req.query.phoneNumber;
		phoneNumber=phoneNumber.replace(/[\(\)\s\-]/g,'');
		console.log(phoneNumber);	
		var phoneTemplate = new RegExp(/^(\+61|0061|0)?4[0-9]{8}$/);
		console.log(">>>>>>>>>>>>>>"+phoneTemplate.test(phoneNumber));
		res.ok({status:phoneTemplate.test(phoneNumber)});
	},
	
	/**
	 * Create Uses Account Controller
	 * Input: req.body: UserName, Email, PhoneNumber,Password
	 * Output: new User Info
	 */
	CreateUserAccount:function(req,res){
		var userInfo={
			UserName:req.body.UserName,
			Email:req.body.Email,
			PhoneNumber:req.body.PhoneNumber,
			Password:req.body.Password,
			Activated:'Y',
			Enable:'Y'
		}
		
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
				res.serverError(ErrorWrap(err));
			});
		});	

	},

	/**
	 * FindByPhoneNumber: Search user by Phone number
	 * Input: req.query.PhoneNumber
	 * Output: user info folowing phone number
	 */
	FindByPhoneNumber:function(req,res)
	{
		var PhoneNumber=req.query.PhoneNumber;
		Services.UserAccount.FindByPhoneNumber(PhoneNumber)
		.then(function(data){
			res.ok(data[0]);
		},function(err){
			if(err.status==404)
				res.notFound(ErrorWrap(err));
			else
				res.serverError(ErrorWrap(err));
		})
	}
}