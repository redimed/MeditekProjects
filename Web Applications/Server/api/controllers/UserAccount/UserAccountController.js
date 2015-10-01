var regexp = require('node-regexp');
var $q = require('q');
module.exports = {
	Test:function(req,res)
	{
		// var re=regexp()
		// 	.start('http')
		// 	.either('+61','0061','0')
		// 	.must('aaa')
		// 	.somethingBut(' ')
		// 	.end('.com')
		// 	.toRegExp();
		var phoneNumber=req.query.phoneNumber;
		// var phoneTemplate = new RegExp(/^[0-9]{10}$|^\(0[1-9]{1}\)[0-9]{8}$|^[0-9]{8}$|^[0-9]{4}[ ][0-9]{3}[ ][0-9]{3}$|^\(0[1-9]{1}\)[ ][0-9]{4}[ ][0-9]{4}$|^[0-9]{4}[ ][0-9]{4}$/);
		// phoneNumber=phoneNumber.replace('+','%2B');
		console.log(phoneNumber);
		phoneNumber=phoneNumber.replace(/[\(\)\s\-]/,'');
		console.log(phoneNumber);	
		var phoneTemplate = new RegExp(/^(\+61|0061|0)?[0-9]{9}$/);
		console.log(">>>>>>>>>>>>>>"+phoneTemplate.test(phoneNumber));
		res.ok({status:phoneTemplate.test(phoneNumber)});
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