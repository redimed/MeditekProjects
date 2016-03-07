/**
 * @namespace UserAccount
 * @memberOf Service
 */

var $q = require('q');
var regexp = require('node-regexp');
var generatePassword = require("password-generator");
var o=require("../HelperService");
var jwt = require('jsonwebtoken');
module.exports = {

	/**
	 * @typedef {object} FindByPhoneNumberException
	 * @memberOf Service.UserAccount
	 * @property {string} ErrorType "FindByPhoneNumber.Error"
	 * @property {Array<string|object} ErrorsList Chỉ sử dụng ErrorsList[0]</br>
	 * - PhoneNumber.invalid</br>
	 * - PhoneNumber.notProvided</br>
	 * - UserAccount.queryError</br>
	 */
	
	/**
	 * @function FindByPhoneNumber
	 * @memberOf Service.UserAccount
	 * @summary Tìm thông tin user bằng số điện thoại
	 * @param {string} PhoneNumber
	 * @param {Array.<string>} attributes
	 * @return {object} user info
	 * @throws {Service.UserAccount.FindByPhoneNumberException}
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
	 * @typedef {object} CreateUserAccountException
	 * @memberOf Service.UserAccount
	 * @property {string} ErrorType "CreateUserAccount.Error"
	 * @property {Array.<string|object>} ErrorsList</br>
	 * - UserNameOrEmailOrPhoneNumber.need</br>
	 * - Password.notFound</br>
	 * - Password.min6chars</br>
	 * - Email.invalid</br>
	 * - PhoneNumber.invalid</br>
	 * - UserName.duplicate</br>
	 * - UserName.queryError</br>
	 * - Email.duplicate</br>
	 * - Email.queryError</br>
	 * - PhoneNumber.duplicate</br>
	 * - PhoneNumber.queryError</br>
	 * - UserName.createError</br>
	 * - PinNumber.max6chars</br>
	 */
	/**
	 * @function CreateUserAccount
	 * @memberOf Service.UserAccount
	 * @summary Tạo UserAccount mới
	 * @param {object} userInfo 
	 *        Cần cung cấp UserName hoặc Email hoặc PhoneNumber
	 * @param {string} userInfo.UserName 
	 * @param {string} userInfo.Email 
	 * @param {string} userInfo.PhoneNumber
	 * @param {object} transaction DB transaction
	 * @return {object} new userAccount
	 * @throws {Service.UserAccount.CreateUserAccountException}
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
				if(userInfo.PinNumber && userInfo.PinNumber.length>6)
				{
					err.pushError('PinNumber.max6chars');
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
					where:{UserName:UserName},
					transaction:transaction,
				})
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
					where:{Email:Email},
					transaction:transaction,
				})
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
					where:{PhoneNumber:PhoneNumber},
					transaction:transaction,
				})
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
			if(!userInfo.PinNumber) delete userInfo.PinNumber;
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
			userInfo.Enable='Y';
			if(userInfo.PinNumber)
				userInfo.ExpiryPin=o.const.ExpiryPin;
			console.log(userInfo);
			return UserAccount.create(userInfo,{transaction:transaction});
			
		},function(e){
			throw e;
		})
		.then(function(data){
			return data;
		},function(e){
			o.exlog(e);
			err.pushError("UserName.createError");
			throw err;
		});
	},
	
	/**
	 * @typedef {object} UpdateUserAccountException
	 * @memberOf Service.UserAccount
	 * @property {string} ErrorType "UpdateUser.Error"
	 * @property {Array.<string|object>} ErrorsList </br>
	 * - UserName.cannotBeNull</br>
	 * - Email.invalid</br>
	 * - PhoneNumber.invalid</br>
	 * - UserAccount.notFound</br>
	 */
	/**
	 * @function UpdateUserAccount
	 * @memberOf Service.UserAccount
	 * @summary Update UserAccount Info
	 * @param {object} userInfo 
	 * @param {string} userInfo.ID 
	 * @param {string} userInfo.UserName 
	 * @param {string} userInfo.Email
	 * @param {string} userInfo.PhoneNumber
	 * @param {object} transaction DB transaction
	 * @return { object} updated userAccount info
	 * @throws { Service.UserAccount.UpdateUserAccountException}
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
			where:{ID:userInfo.ID},
			transaction:transaction,
		})
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
	
	/**
	 * @function DisableUserAccount
	 * @memberOf Service.UserAccount
	 * @summary Disable userAccount
	 * @param {object} criteria 
	 *        Điều kiện để query thông tin user.
	 *        Cần cung cấp một trong các tham số ID,UID,UserName,Email,Phone
	 * @param {string} criteria.ID 
	 * @param {string} criteria.UID
	 * @param {string} criteria.UserName 
	 * @param {string} criteria.Email 
	 * @param {string} criteria.PhoneNumber 
	 * @param {object} transaction DB transaction
	 * @return {Array.<number>}
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
			where:whereClause,
			transaction:transaction,
		});
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
			where:whereClause,
			transaction:transaction,
		});
	},

	/**
	 * @typedef {object} GetUserAccountDetailsException
	 * @memberOf UserAccountService
	 * @property {string} ErrorType "GetUserAccountDetails.Error"
	 * @property {Array.<string|object>} ErrorsList Chỉ sử dụng ErrorsList[0]</br>
	 * GetUserAccountDetails.emailInvalid</br>
	 * GetUserAccountDetails.phoneNumberInvalid</br>
	 * GetUserAccountDetails.criteriaNotFound</br>
	 * GetUserAccountDetails.queryError</br>
	 */
	/**
	 * @function GetUserAccountDetails
	 * @memberOf UserAccountService
	 * @param {object} criteria điều kiện truy vấn user
	 * @param {string} [criteria.UID]
	 * @param {string} [criteria.UserName]
	 * @param {string} [criteria.Email]
	 * @param {string} [criteria.PhoneNumber]
	 * @param {Array.<string>} attributes Các field dữ liệu muốn trả về
	 * @param {object} transaction DB transaction
	 * @return {object} user info
	 * @throws {UserAccountService.GetUserAccountDetailsException}
	 */
	GetUserAccountDetails:function(criteria,attributes,transaction)
	{
		console.log(criteria);
		var error = new Error('GetUserAccountDetails.Error');
		var whereClause={Enable:'Y'};

		function Validation()
		{
			var q=$q.defer();
			try{
				if(criteria.UID)
					whereClause.UID=criteria.UID;
				if(criteria.UserName)
					whereClause.UserName=criteria.UserName;
				if(criteria.Email)
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
				if(criteria.PhoneNumber)
				{
					criteria.PhoneNumber=o.parseAuMobilePhone(criteria.PhoneNumber);
					console.log(criteria.PhoneNumber);
					if(criteria.PhoneNumber)
						whereClause.PhoneNumber=criteria.PhoneNumber;
					else{
						error.pushError("GetUserAccountDetails.phoneNumberInvalid");
					}
				}
				// else
				// {
				// 	error.pushError('GetUserAccountDetails.criteriaNotFound');
				// }

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
				where:{$or:whereClause},
				attributes:attributes,
				transaction:transaction,
			})
			.then(function(user){
				return user;
			},function(err){
				o.exlog(err);
				error.pushError("GetUserAccountDetails.queryError");
				throw error;
			})
		},function(err){
			console.log("vay la loi o day ????");
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
			where:whereClause,
			transaction:transaction,
		})
		.then(function(count){
			totalRows=count;
			return UserAccount.findAll({
				where:whereClause,
				limit:limit,
				offset:offset,
				attributes:attributes,
				order:order,
				transaction:transaction,
			})
		},function(err){
			throw err;
		})
		.then(function(rows){
			return {totalRows:totalRows,rows:rows};
		},function(err){
			throw err;
		})
	},


	/**
	 * RemoveIdentifierImage: dùng để xóa profile image và signature image của user
	 * input:
	 * - criteria: {UserUID|UserName|Email|PhoneNumber, Type}
	 * 		+Type: HelperService.const.fileType.avatar, HelperService.const.fileType.signature
	 * -transaction
	 * output
	 * - Nếu thành công trả về {status:'success'}
	 * - Nếu thất bại quăng về error:
	 * 		error.errors[0]:
	 *			+ RemoveIdentifierImage.emailInvalid
	 *			+ RemoveIdentifierImage.phoneNumberInvalid
	 *			+ RemoveIdentifierImage.userInfoNotProvided
	 *			+ RemoveIdentifierImage.typeInvalid
	 *			+ RemoveIdentifierImage.typeNotProvided
	 *			+ RemoveIdentifierImage.imageNotFound
	 *			+ RemoveIdentifierImage.fileUploadUpdateError
	 *			+ RemoveIdentifierImage.userNotFound
	 *			+ RemoveIdentifierImage.userQueryError
	 */
	RemoveIdentifierImage:function(criteria,transaction)
	{
		var error=new Error("RemoveIdentifierImage.Error");
		var whereClause={};
		var Type=null;
		var Validation=function()
		{
			var q=$q.defer();
			try
			{
				if(o.checkData(criteria.UserUID))
				{
					whereClause.UID=criteria.UserUID;
				}
				else if(o.checkData(criteria.UserName))
				{
					whereClause.UserName=criteria.UserName;
				}
				else if(o.checkData(criteria.Email))
				{
					if(o.isValidEmail(criteria.Email))
					{
						whereClause.Email=criteria.Email;
					}
					else
					{
						error.pushError("RemoveIdentifierImage.emailInvalid");
						throw error;
					}
				}
				else if(o.checkData(criteria.PhoneNumber))
				{
					criteria.PhoneNumber=o.parseAuMobilePhone(criteria.PhoneNumber);
					if(criteria.PhoneNumber)
					{
						whereClause.PhoneNumber=criteria.PhoneNumber;
					}
					else
					{
						error.pushError("RemoveIdentifierImage.phoneNumberInvalid");
						throw error;
					}
				}
				else
				{
					error.pushError("RemoveIdentifierImage.userInfoNotProvided");
					throw error;
				}
				if(o.checkData(criteria.Type))
				{
					if([o.const.fileType.avatar,o.const.fileType.signature].indexOf(criteria.Type)>=0)
					{
						Type=criteria.Type;
					}
					else 
					{
						error.pushError("RemoveIdentifierImage.typeInvalid");
						throw error;
					}
				}
				else
				{
					error.pushError("RemoveIdentifierImage.typeNotProvided");
					throw error;
				}

				q.resolve({status:"success"});

			}
			catch(err)
			{
				q.reject(err);
			}
			return q.promise;
		}

		return Validation()
		.then(function(data){
			return Services.UserAccount.GetUserAccountDetails(whereClause,null,transaction)
			.then(function(user){
				if(o.checkData(user))
				{
					return FileUpload.update({Enable:'N'},{
						where:{
							UserAccountID:user.ID,
							FileType:Type,
						},
						transaction:transaction,
					})
					.then(function(result){
						if(result[0]>0)
							return {status:'success'};
						else
						{
							error.pushError("RemoveIdentifierImage.imageNotFound");
							throw error;
						}
					},function(err){
						o.exlog(err);
						error.pushError("RemoveIdentifierImage.fileUploadUpdateError");
						throw error;
					})
				}
				else
				{
					error.pushError("RemoveIdentifierImage.userNotFound");
					throw error;
				}
			},function(err){
				o.exlog(err);
				error.pushError("RemoveIdentifierImage.userQueryError");
				throw error;
			})
		},function(err){
			throw err;
		})
		
	},

	/**
	 * GetIdentifierImageInfo: dùng để lấy thông tin profile image và signature image của user
	 * input:
	 * - criteria: {UserUID|UserName|Email|PhoneNumber, Type}
	 * 		+Type: HelperService.const.fileType.avatar, HelperService.const.fileType.signature
	 * -transaction
	 * output
	 * - Nếu thành công trả thông tin file, thông tin file có thể null nếu không tìm thấy trong database
	 * - Nếu thất bại quăng về error:
	 * 		error.errors[0]:
	 *			+ GetIdentifierImageInfo.emailInvalid
	 *			+ GetIdentifierImageInfo.phoneNumberInvalid
	 *			+ GetIdentifierImageInfo.userInfoNotProvided
	 *			+ GetIdentifierImageInfo.typeInvalid
	 *			+ GetIdentifierImageInfo.typeNotProvided
	 *			+ GetIdentifierImageInfo.fileUploadQueryError
	 *			+ GetIdentifierImageInfo.userNotFound
	 *			+ GetIdentifierImageInfo.userQueryError
	 */
	GetIdentifierImageInfo:function(criteria,attributes,transaction)
	{
		var error=new Error("RemoveIdentifierImage.Error");
		var whereClause={};
		var Type=null;
		var Validation=function()
		{
			var q=$q.defer();
			try
			{
				if(o.checkData(criteria.UserUID))
				{
					whereClause.UID=criteria.UserUID;
				}
				else if(o.checkData(criteria.UserName))
				{
					whereClause.UserName=criteria.UserName;
				}
				else if(o.checkData(criteria.Email))
				{
					if(o.isValidEmail(criteria.Email))
					{
						whereClause.Email=criteria.Email;
					}
					else
					{
						error.pushError("GetIdentifierImageInfo.emailInvalid");
						throw error;
					}
				}
				else if(o.checkData(criteria.PhoneNumber))
				{
					criteria.PhoneNumber=o.parseAuMobilePhone(criteria.PhoneNumber);
					if(criteria.PhoneNumber)
					{
						whereClause.PhoneNumber=criteria.PhoneNumber;
					}
					else
					{
						error.pushError("GetIdentifierImageInfo.phoneNumberInvalid");
						throw error;
					}
				}
				else
				{
					error.pushError("GetIdentifierImageInfo.userInfoNotProvided");
					throw error;
				}
				if(o.checkData(criteria.Type))
				{
					if([o.const.fileType.avatar,o.const.fileType.signature].indexOf(criteria.Type)>=0)
					{
						Type=criteria.Type;
					}
					else 
					{
						error.pushError("GetIdentifierImageInfo.typeInvalid");
						throw error;
					}
				}
				else
				{
					error.pushError("GetIdentifierImageInfo.typeNotProvided");
					throw error;
				}

				q.resolve({status:"success"});

			}
			catch(err)
			{
				q.reject(err);
			}
			return q.promise;
		}

		return Validation()
		.then(function(data){
			return Services.UserAccount.GetUserAccountDetails(whereClause,null,transaction)
			.then(function(user){
				if(o.checkData(user))
				{
					return FileUpload.findOne({
						where:{
							UserAccountID:user.ID,
							FileType:Type,
							Enable:'Y'
						},
						attributes:attributes,
						transaction:transaction,
					})
					.then(function(file){
						return file;
					},function(err){
						o.exlog(err);
						error.pushError("GetIdentifierImageInfo.fileUploadQueryError");
						throw error;
					})
				}
				else
				{
					error.pushError("GetIdentifierImageInfo.userNotFound");
					throw error;
				}
			},function(err){
				o.exlog(err);
				error.pushError("GetIdentifierImageInfo.userQueryError");
				throw error;
			})
		},function(err){
			throw err;
		})
	},


	CheckExistUser:function(criteria,attributes,transaction)
	{
		var error=new Error("CheckExistUser.Error");
		var whereClause=[];
		function Validation()
		{
			var q=$q.defer();
			try
			{
				var criteriaValidation={
					UserName:null,
					Email:null,
					PhoneNumber:null
				}
				o.rationalizeObject(criteria,criteriaValidation);
				if(_.isObject(criteria) && !_.isEmpty(criteria))
				{
					if(o.checkData(criteria.PhoneNumber))
					{
						criteria.PhoneNumber=o.parseAuMobilePhone(criteria.PhoneNumber);
						if(!o.checkData(criteria.PhoneNumber))
						{
							error.pushError("CheckExistUser.phoneNumberInvalid");
							throw error;
						}
					}
					if(o.checkData(criteria.Email))
					{
						if(!o.isValidEmail(criteria.Email))
						{
							error.pushError("CheckExistUser.emailInvalid");
							throw error;
						}
					}
					whereClause=o.splitAttributesToObjects(criteria);
					q.resolve({status:'success'});
					
				}
				else
				{
					error.pushError("CheckExistUser.paramsNotFound");
					throw error;
				}
			}
			catch(err)
			{
				q.reject(err);
			}
			
			return q.promise;
		}

		return Validation()
		.then(function(data){
			return UserAccount.findOne({
				where:{
					$or:whereClause
				},
				transaction:transaction,
			})
			.then(function(user){
				return user;
			},function(err){
				o.exlog(err);
				error.pushError("CheckExistUser.userQueryError");
				throw error;
			});
		},function(err){
			throw err;
		});

		
		
	},

	getDetailUser:function(data)
	{
		return UserAccount.findOne({
			include: [
				{
			       	model: Doctor,
			        attributes: ['Title','FirstName','LastName'],
			        required: false
			    },
			    {
			       	model: Patient,
			        attributes: ['Title','FirstName','LastName'],
			        required: false
			    },
			    {
			       	model: FileUpload,
			        attributes: ['UID'],
			        required: false,
			        where:{
			        	Enable:'Y',
			        	FileType:'ProfileImage'
			        }
			    }
			],
			subQuery   : false,
			attributes:['UserName','Email'],
			where:{
				UID: data.UID
			}
		});
	},

	sendMail:function(data, secret, transaction, functionA) 
	{
		var payload = {
                UID : data.UID
        };
        var token = jwt.sign(
                        payload,
                        secret,
                        {expiresIn:2*60*60}
       	);
        var emailInfo = {
            from    : 'Redimed <giangvotest2511@gmail.com>',
            email   : data.email?data.email:data.Email,
            subject : 'Forgot Password',
            data    : token,
            UID     : data.UID
        };
        return UserForgot.create({
        	UserAccountUID : data.UID,
        	Token          : token
        },{transaction: transaction})
        .then(function(success){
        	SendMailService.SendMail
        		('demo', emailInfo, functionA);
        },function(err){
        	throw err;
        });
	}

}
