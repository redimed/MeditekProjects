var $q = require('q');
var regexp = require('node-regexp');
var generatePassword = require("password-generator");
_= require('underscore');
module.exports = {


	FindByPhoneNumber:function(PhoneNumber,attributes)
	{
		return UserAccount.findAll({
			where :{
				PhoneNumber:PhoneNumber
			},
			attributes:attributes
		});
	},

	/**
	 * CreateUserAccount: create user account
	 * Input:
	 * 		userInfo:{UserName, Password, Email, PhoneNumber}
	 * 		transaction(optiont):nếu có transaction sẽ áp dụng transaction vào các câu truy vấn
	 * 	Output:
	 * 		if success return promise UserAccount.create
	 * 		if error throw error:
	 * 			error.errors[] có thể bao gồm:
	 * 				-Password.notFound: không tìm thấy passoword
	 * 				-Password.min6chars: password phải ít nhất 6 kí tự
	 * 				-Email.invalid: lỗi định dạng email
	 * 				-PhoneNumber.invalid: lỗi định dạng phone number
	 * 				-UserNameOrEmailOrPhoneNumber.need: cần phải có thông tin UserName, Email hoặc PhoneNumber (chỉ cần 1 trong 3)
	 */
	CreateUserAccount:function(userInfo,transaction)
	{
		userInfo.UID=UUIDService.Create();
		function Validate()
		{
			var q=$q.defer();
			try {
				var err=new Error('Your data invalid');

				//UserName or Email or PhoneNumber must not null
				if(!userInfo.UserName && !userInfo.Email && !userInfo.PhoneNumber)
				{
					err.pushError('UserNameOrEmailOrPhoneNumber.need');
				}

				//Password
				if(!userInfo.Password)
				{
					err.pushError('Password.notFound');
				}
				else
				{
					if(userInfo.Password.length<6)
					{
						//password phải ít nhất 6 kí tự
						err.pushError('Password.min6chars');
					}
				}
				//email validation
				var emailPattern = new RegExp(HelperService.regexPattern.email);
				// if(userInfo.Email && emailPattern.test(userInfo.Email))
				if(userInfo.Email && !emailPattern.test(userInfo.Email))
				{
					err.pushError('Email.invalid')
				}
				//Phone number validation
				//autralian phone number regex
				var auPhoneNumberPattern=new RegExp(HelperService.regexPattern.auPhoneNumber);
				//remove (,),whitespace,- from phone number
				userInfo.PhoneNumber=userInfo.PhoneNumber.replace(HelperService.regexPattern.phoneExceptChars,'');
				if(userInfo.PhoneNumber && !auPhoneNumberPattern.test(userInfo.PhoneNumber))
				{
					err.pushError('PhoneNumber.invalid');
				}
				
				if(err.getErrors().length>0)
				{
					throw err;
				}
				else
				{
					q.resolve({status:'success'});
				}
			}
			catch(err) {			
			    q.reject(err);
			}
			return q.promise;
		}

		return Validate()
		.then(function(data){
			//Kiem tra neu khong co UserName nhung co Email hoac PhoneNumber
			//thi lay Email hoac PhoneNumber lam UserName
			
			if(!userInfo.UserName)
			{
				if(userInfo.Email)
					userInfo.UserName=userInfo.Email;
				if(userInfo.PhoneNumber)
					userInfo.UserName=userInfo.PhoneNumber;
			}
			if(!userInfo.Email) delete userInfo.Email;
			if(!userInfo.PhoneNumber) delete userInfo.PhoneNumber;
			return UserAccount.create(userInfo,{transaction:transaction});
		},function(err){
			throw err;
		})
	},

	/**
	 * UpdateUserAccount
	 * Input:
	 * 	userInfo: json chứ thông tin user từ client gửi lên
	 * 	transaction: nếu được cung cấp thì áp dụng transaction vào các câu truy vấn
	 * 	output:
	 * 	Nếu success trả về promise update userAccount attribute
	 * 	Nếu fail throw về error
	 */
	UpdateUserAccount:function(userInfo,transaction)
	{
		function Validation(updateInfo)
		{
			var q=$q.defer();
			try{
				var err=new Error('UpdateUser.Error');

				//UserName or Email or PhoneNumber must not null
				if(!updateInfo.UserName)
				{
					err.pushError('UserName.cannotBeNull');
				}
				//Email validation
				if(updateInfo.Email) 
				{
					var emailPattern = new RegExp(HelperService.regexPattern.email);
					if(updateInfo.Email && !emailPattern.test(updateInfo.Email))
					{
						err.pushError('Email.invalid');
					}
				}
				//Phone number validation
				if(updateInfo.PhoneNumber)
				{
					//autralian phone number regex
					var auPhoneNumberPattern=new RegExp(HelperService.regexPattern.auPhoneNumber);
					//remove (,),whitespace,- from phone number
					updateInfo.PhoneNumber=updateInfo.PhoneNumber.replace(HelperService.regexPattern.phoneExceptChars,'');
					if(updateInfo.PhoneNumber && !auPhoneNumberPattern.test(updateInfo.PhoneNumber))
					{
						err.pushError('PhoneNumber.invalid');
					}
				}
				if(err.getErrors().length>0)
				{
					throw err;
				}
				else
				{
					q.resolve({status:'success'});
				}

			}
			catch(err)
			{
				q.reject(err);
			}
			return q.promise;
		}

		var userAccount={};
		var userAccountDetail={};
		//Lấy thông tin user tương ứng với id
		return UserAccount.findOne({
			where:{ID:userInfo.ID}
		},{transaction:transaction})
		.then(function(u){
			if(u)
			{
				userAccount=u;
				userAccountDetail=_.clone(u.dataValues);
				//merge thông tin client gửi lên vào userAccountDetail
				_.extend(userAccountDetail,userInfo);
				return Validation(userAccountDetail);
			}
			else
			{
				var err=new Error('User not found');
				err.pushError('UserAccount.notFound');
				throw err;
			}
			
		},function(err){
			throw err;
		})
		.then(function(data){
			return userAccount.updateAttributes(userAccountDetail,{transaction:transaction})
		},function(err){
			throw err;
		})
	},

	/**
	 * DisableUserAccount: 
	 * disable thông qua các tiêu chí ID, UID, UserName, Email, Phone,
	 * chỉ cần 1 trong 5 tiêu chí được cung cấp thì user tương ứng sẽ bị disable
	 * Input:
	 * 	criteria: là json chứa 1 trong các thuộc tính [ID, UID, UserName, Email, Phone]
	 * 	transaction: nếu được cung cấp thì sẽ áp dụng transaction vào các câu truy vấn
	 * Output:
	 * 	if success return promise update UserAccount
	 * 	if error throw err;
	 */
	DisableUserAccount:function(criteria,transaction)
	{
		var whereClause={};
		if(criteria.ID)
			whereClause.ID=criteria.ID;
		else if(criteria.UID)
			whereClause.UID=criteria.UID;
		else if(criteria.UserName)
			whereClause.UserName=criteria.UserName;
		else if(criteria.Email)
			whereClause.Email=criteria.Email;
		else if(criteria.PhoneNumber)
			whereClause.PhoneNumber=criteria.PhoneNumber;
		else
		{
			var err=new Error('DisableUserAccount.Error');
			err.pushError('DisableUserAccount.criteriaNotFound');
			throw err;
		}
		return UserAccount.update({Enable:'N'},{
			where:whereClause
		},{transaction:transaction});
	},


	/**
	 * EnableUserAccount: 
	 * enable thông qua các tiêu chí ID, UID , UserName, Email, Phone,
	 * chỉ cần 1 trong 5 tiêu chí được cung cấp thì user tương ứng sẽ bị enable
	 * Input:
	 * 	criteria: là json chứa 1 trong các thuộc tính [ID, UID, UserName, Email, Phone]
	 * 	transaction: nếu được cung cấp thì sẽ áp dụng transaction vào các câu truy vấn
	 * Output:
	 * 	if success return promise update UserAccount
	 * 	if error throw err;
	 */
	EnableUserAccount:function(criteria,transaction)
	{
		var whereClause={};
		if(criteria.ID)
			whereClause.ID=criteria.ID;
		else if(criteria.UID)
			whereClause.UID=criteria.UID;
		else if(criteria.UserName)
			whereClause.UserName=criteria.UserName;
		else if(criteria.Email)
			whereClause.Email=criteria.Email;
		else if(criteria.PhoneNumber)
			whereClause.PhoneNumber=criteria.PhoneNumber;
		else
		{
			var err=new Error('EnableUserAccount.Error');
			err.pushError('EnableUserAccount.criteriaNotFound');
			throw err;
		}
		return UserAccount.update({Enable:'Y'},{
			where:whereClause
		},{transaction:transaction});
	},

	/**
	 * GetUserAccountDetails: 
	 * Trả về thông tin user thông qua các tiêu chí UID , UserName, Email, Phone,
	 * chỉ cần 1 trong 4 tiêu chí được cung cấp thì user tương ứng sẽ được trả về
	 * Input:
	 * 	criteria: là json chứa 1 trong các thuộc tính [UID, UserName, Email, Phone]
	 * 	transaction: nếu được cung cấp thì sẽ áp dụng transaction vào các câu truy vấn
	 * Output:
	 * 	if success return promise update UserAccount
	 * 	if error throw err;
	 * 	NOTES:
	 * 		CHÚ Ý, KHÔNG LẤY USER ACCOUNT THÔNG QUA ID VÌ ID THEO CƠ CHẾ TỰ TĂNG, NHƯ THẾ
	 * 	 	SẼ KHÔNG AN TOÀN VÌ NGƯỜI DÙNG CÓ THỂ DÙNG TOOL ĐỂ TỰ ĐỘNG ĐIỀN ID
	 */
	GetUserAccountDetails:function(criteria,transaction)
	{
		var whereClause={};
		if(criteria.UID)
			whereClause.UID=criteria.UID;
		else if(criteria.UserName)
			whereClause.UserName=criteria.UserName;
		else if(criteria.Email)
			whereClause.Email=criteria.Email;
		else if(criteria.PhoneNumber)
			whereClause.PhoneNumber=criteria.PhoneNumber;
		else
		{
			var err=new Error('GetUserAccountDetails.Error');
			err.pushError('GetUserAccountDetails.criteriaNotFound');
			throw err;
		}
		return UserAccount.findOne({
			where:criteria
		},{transaction:transaction});
	},



	GetListUsers:function(clause,transaction)
	{
		var criteria=clause.criteria;
		var attributes=clause.attributes;
		var limit=clause.limit;
		var offset=clause.offset;
		var order=_.pairs(clause.order);
		var whereClause={};
		if(criteria.UID)
		{

			whereClause.UID={
				like:'%'+criteria.UID+'%'
			}
		}
		if(criteria.UserName)
		{
			// whereClause.UserName='tan'
			whereClause.UserName={
				$like:'%'+criteria.UserName+'%'
			}

		}
		if(criteria.Email)
		{
			whereClause.Email={
				like:'%'+criteria.Email+'%'
			}
		}
		if(criteria.PhoneNumber)
		{
			whereClause.PhoneNumber={
				like:'%'+criteria.PhoneNumber+'%'
			}
		}
		if(criteria.Activated)
		{
			whereClause.Activated=criteria.Activated;
		}
		if(criteria.Enable)
		{
			whereClause.Enable=criteria.Enable;
		}
		if(criteria.UserType)
		{
			whereClause.UserType=criteria.UserType;
		}

		var totalRows=0;
		return UserAccount.count({
			where:whereClause
		},{transaction:transaction})
		.then(function(count){
			totalRows=count;
			return UserAccount.findAll({
				where:whereClause,
				limit:limit,
				offset:offset,
				attributes:attributes,
				order:order
			})
		},function(err){
			throw err;
		})
		.then(function(rows){
			return {totalRows:totalRows,rows:rows};
		},function(err){
			throw err;
		})
	}
}
