var $q = require('q');
var regexp = require('node-regexp');
var generatePassword = require("password-generator");
var o=require("../HelperService");
module.exports = {


	/**
	 * FindByPhoneNumber: tìm kiếm user thông qua PhoneNumber
	 * Input: 
	 * 	PhoneNumber
	 * 	attributes: các field thông tin muốn lấy
	 * Output:
	 * 	
	 */
	FindByPhoneNumber:function(PhoneNumber,attributes)
	{
		var err=new Error("FindByPhoneNumber.Error");
		function Validate()
		{
			var q=$q.defer();
			//Phone number validation
			//autralian phone number regex
			var auPhoneNumberPattern=new RegExp(HelperService.regexPattern.auPhoneNumber);
			if(PhoneNumber)
			{
				//remove (,),whitespace,- from phone number
				PhoneNumber=PhoneNumber.replace(HelperService.regexPattern.phoneExceptChars,'');
				if(!auPhoneNumberPattern.test(PhoneNumber))
				{
					err.pushError('PhoneNumber.invalid');
				}
			}
			else
			{
				err.pushError("PhoneNumber.notProvided");
			}

			if(err.getErrors().length>0)
			{
				q.reject(err);
			}
			else
			{
				q.resolve({status:'success'});
			}
			return q.promise;
		}

		return Validate()
		.then(function(data){
			PhoneNumber=PhoneNumber.slice(-9);
			PhoneNumber='+61'+PhoneNumber;
			return UserAccount.findAll({
				where :{
					PhoneNumber:PhoneNumber
				},
				attributes:attributes
			})
			.then(function(data){
				return data;
			},function(e){
				o.exlog(e);
				err.pushError('UserAccount.queryError');
				throw err;
			})
		},function(e){
			throw e;
		})
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
	 * 				-UserName.duplicate: UserName bị trùng
	 * 				-Email.duplicate: Email bị trùng
	 * 				-PhoneNumber.duplicate: PhoneNumber bị trùng
	 * 				
	 * 				
	 */
	CreateUserAccount:function(userInfo,transaction)
	{
		userInfo.UID=UUIDService.Create();
		var err=new Error('CreateUserAccount.Error');
		function Validate()
		{
			var q=$q.defer();
			try {
				

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
				if(userInfo.PhoneNumber)
				{
					//remove (,),whitespace,- from phone number
					userInfo.PhoneNumber=userInfo.PhoneNumber.replace(HelperService.regexPattern.phoneExceptChars,'');
					if(!auPhoneNumberPattern.test(userInfo.PhoneNumber))
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
			catch(err) {			
			    q.reject(err);
			}
			return q.promise;
		}

		function checkUserName(UserName)
		{
			var q=$q.defer();
			if(UserName)
			{
				
				UserAccount.findOne({
					where:{UserName:UserName}
				},{transaction:transaction})
				.then(function(user){
					if(user)
					{
						err.pushError("UserName.duplicate");
						q.reject(err);
					}
					else
					{
						q.resolve();
					}
				},function(e){
					o.exlog(e);
					err.pushError("UserName.queryError");
					q.reject(err);
				})
			}
			else
			{
				q.resolve();
			}
			return q.promise;
		}

		function checkEmail(Email)
		{
			var q=$q.defer();
			if(Email)
			{
				UserAccount.findOne({
					where:{Email:Email}
				},{transaction:transaction})
				.then(function(user){
					if(user)
					{
						err.pushError("Email.duplicate");
						q.reject(err);
					}
					else
					{
						q.resolve();
					}
				},function(e){
					o.exlog(e);
					err.pushError("Email.queryError");
					q.reject(err);
				})
			}
			else
			{
				q.resolve();
			}
			return q.promise;
		}

		function checkPhoneNumber(PhoneNumber)
		{
			var q=$q.defer();
			if(PhoneNumber)
			{
				UserAccount.findOne({
					where:{PhoneNumber:PhoneNumber}
				},{transaction:transaction})
				.then(function(user){
					if(user)
					{
						err.pushError("PhoneNumber.duplicate");
						q.reject(err);
					}
					else
					{
						q.resolve();
					}
				},function(e){
					o.exlog(e);
					err.pushError("PhoneNumber.queryError");
					q.reject(err);
				})
			}
			else
			{
				q.resolve();
			}
			return q.promise;
		}

		return Validate()
		.then(function(data){
			//Định dạng lại kiểu phoneNumber lưu vào database. Có dạng: +61412345678
			if(userInfo.PhoneNumber)
			{
				userInfo.PhoneNumber=userInfo.PhoneNumber.slice(-9);
				userInfo.PhoneNumber='+61'+userInfo.PhoneNumber;
			}
			//Kiem tra neu khong co UserName nhung co Email hoac PhoneNumber
			//thi lay Email hoac PhoneNumber lam UserName
			if(!userInfo.UserName)
			{
				if(userInfo.Email)
					userInfo.UserName=userInfo.Email;
				else
					userInfo.UserName=userInfo.PhoneNumber;
			}
			//Kiểm tra nếu Email và PhoneNumber là chuỗi rỗng thì không được đưa vào database
			if(!userInfo.Email) delete userInfo.Email;
			if(!userInfo.PhoneNumber) delete userInfo.PhoneNumber;
			//-----
			return checkUserName(userInfo.UserName);
		})
		.then(function(user){
			return checkEmail(userInfo.Email);
			// return UserAccount.create(userInfo,{transaction:transaction});
		})
		.then(function(user){
			return checkPhoneNumber(userInfo.PhoneNumber);
		})
		.then(function(user){
			return UserAccount.create(userInfo,{transaction:transaction})
			.then(function(data){
				return data;
			},function(e){
				o.exlog(e);
				err.pushError("UserName.createError");
				throw err;
			})
		},function(e){
			throw e;
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
		
		//---------------------------------------------
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
				//Không được cập nhật password theo quy trình này
				delete userAccountDetail.Password;
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
	 * 	attributes: chứa các field muốn trả về
	 * 	transaction: nếu được cung cấp thì sẽ áp dụng transaction vào các câu truy vấn
	 * Output:
	 * 	if success return promise getOne UserAccount
	 * 	if error throw err;
	 * 	NOTES:
	 * 		CHÚ Ý, KHÔNG LẤY USER ACCOUNT THÔNG QUA ID VÌ ID THEO CƠ CHẾ TỰ TĂNG, NHƯ THẾ
	 * 	 	SẼ KHÔNG AN TOÀN VÌ NGƯỜI DÙNG CÓ THỂ DÙNG TOOL ĐỂ TỰ ĐỘNG ĐIỀN ID
	 */
	GetUserAccountDetails:function(criteria,attributes,transaction)
	{
		var error=new Error('GetUserAccountDetails.Error');
		var whereClause={Enable:'Y'};

		function Validation()
		{
			var q=$q.defer();
			try{
				if(criteria.UID)
					whereClause.UID=criteria.UID;
				else if(criteria.UserName)
					whereClause.UserName=criteria.UserName;
				else if(criteria.Email)
				{
					if(o.isValidEmail(criteria.Email))
					{
						whereClause.Email=criteria.Email;
					}
					else
					{
						error.pushError("GetUserAccountDetails.emailInvalid");
					}
				}
				else if(criteria.PhoneNumber)
				{
					criteria.PhoneNumber=o.parseAuMobilePhone(criteria.PhoneNumber);
					console.log(criteria.PhoneNumber);
					if(criteria.PhoneNumber)
						whereClause.PhoneNumber=criteria.PhoneNumber;
					else{
						error.pushError("GetUserAccountDetails.phoneNumberInvalid");
					}
				}
				else
				{
					error.pushError('GetUserAccountDetails.criteriaNotFound');
				}

				if(error.getErrors().length>0)
				{
					throw error;
				}
				else
				{
					q.resolve({status:'success'});
				}
			}
			catch(err){
				q.reject(err);
			}
			
			return q.promise;
		}
		
		return Validation()
		.then(function(data){
			return UserAccount.findOne({
				where:whereClause,
				attributes:attributes
			},{transaction:transaction})
			.then(function(user){
				return user;
			},function(err){
				o.exlog(err);
				error.pushError("GetUserAccountDetails.queryError");
				throw error;
			})
		},function(err){
			throw err;
		})
	},


	/**
	 * GetListUsers
	 * Input:
	 * 	clause:
	 * 		-criteria: chứa các key và value để filter dữ liệu
	 * 		-attributes: tên các trường sẽ trả về
	 * 		-limit: trả về bao nhiêu dòng dữ liệu
	 * 		-offset: bỏ qua bao nhiêu dữ liệu đầu tiên
	 * 		-order: ví dụ { UserName:'ASC',Email:'DESC' }
	 */
	GetListUsers:function(clause,transaction)
	{
		var criteria=clause.criteria;
		var attributes=clause.attributes;
		var limit=clause.limit;
		var offset=clause.offset;
		var order=_.pairs(clause.order);
		var whereClause={};

		//Tạo điều kiện lọc tương ứng cho từng field
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

		//Tính tổng số kết quả tương ứng điều kiện whereClause
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
