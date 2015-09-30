var regexp = require('node-regexp');
var $q = require('q');
// var TestController=require('../TestController');
module.exports = {
	Test:function(req,res)
	{
		// var rePattern = new RegExp(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/);
		// console.log(">>>>>>>>>"+rePattern.test('mysite@ ourearth.com.vn'));
		console.log(sails.controllers.test.Test());
		var phonePattern= new RegExp(HelperService.regexPattern.fullPhoneNumber);
		console.log(">>>>>>>>>"+phonePattern.test('442071111111'));
		res.json({status:'finish'});
		// UserAccount.findOne({
		// 	where :{UserName: u}
		// })
		// .then(function(user){
		// 	res.json(200,user);
		// },function(err){
		// 	res.json(500,err);
		// })
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
		UserAccountService.CreateUserAccount(userInfo)
		.then(function(data){
			res.ok(data);
		},function(err){
			res.serverError({message:err.message});
		})
	},

	/**
	 * FindByPhoneNumber: Search user by Phone number
	 * Input: req.query.PhoneNumber
	 * Output: 
	 */
	FindByPhoneNumber:function(req,res)
	{
		UserAccountService.FindByPhoneNumber(req,res)
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