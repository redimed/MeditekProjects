var $q = require('q');
var randomstring = require("randomstring");
var o=require("../HelperService");
var moment=require("moment");
module.exports = {
	/**
	 * TODO
	 */
	CheckActivated:function(userInfo,transaction)
	{
		var error=new Error("UserActivation.Error");
		var whereClause={};
		if(_.isObject(userInfo) && _.isEmpty(userInfo))
		{
			if(o.checkData(userInfo.UID))
			{
				whereClause.UID=userInfo.UID;
			}
			else if(o.checkData(userInfo.UserName))
			{
				whereClause.UserName=userInfo.UserName;
			}
			else if(o.checkData(userInfo.Email))
			{
				whereClause.Email=userInfo.Email;
			}
			else if(o.checkData(userInfo.PhoneNumber)){
				whereClause.PhoneNumber=userInfo.PhoneNumber;
			}
			else
			{
				error.pushError("CheckActivated.conditionNotFound");
			}
		}
		else
		{
			error.pushError("CheckActivated.requireUserInfo");
		}
		if(error.getErrors().length>0)
		{
			throw error;
		}

		return UserAccount.findOne({
			where:whereClause
		},{transaction:transaction})
		.then(function(user){
			if(user)
			{

			}
			else
			{

			}
		},function(err){
			throw err;
		})
		.then(function(data){

		},function(err){

		})
	},

	/**
	 * CreateUserActivation: Tạo UserActivation
	 *	Đối với web system: mỗi user chỉ có 1 record
	 *	Đối với mobile system: tương ứng với mỗi cặp {userId, deviceId} có 1 record
	 *	Nếu record activation của user đã tồn tại thì update, nếu chưa thì insert mới
	 * 		+trường hợp update: các thông tin được update: 
	 * 			VerificationCode,VerificationToken,TokenCreatedDate,TokenExpired,CodeExpired,
	 * 			ModifiedBy,ModifiedDate
	 * 		+trường hợp insert: các thông tin được insert:
	 * 			UserAccountID,Type,VerificationCode,VerificationToken,CreatedBy,TokenCreatedDate,
	 * 			TokenExpired,CodeExpired,CreatedDate
	 *
	 * Input: 
	 * - activationInfo:{UserUID,Type,CreatedBy}
	 * output: 
	 * 	nếu thành công trả về UserActivationInfo
	 * 	nếu lỗi thì trả về error, trong error có mảng errors
	 * 		errors[0]:
	 * 			+ UserUID.notProvided: UserUID chưa được cung cấp
	 *			+ SystemType.notProvided: SystemType chưa được cung cấp
	 *			+ DeviceID.notProvided: DeviceID chưa được cung cấp
	 *			+ SystemType.unknown: SystemType không hợp lệ
	 *			+ CreateUserActivation.paramsNotFound: chưa cung cấp tham số
	 *			+ CreateUserActivation.updateActivationError: lỗi update activation
	 *			+ CreateUserActivation.userActivationInsertError: lỗi insert activation
	 *			+ CreateUserActivation.checkExistQueryError: lỗi truy vấn kiểm tra activation đã tồn tại
	 *			+ CreateUserActivation.userNotFound: không tìm thấy user tương ứng UID
	 *			+ CreateUserActivation.userQueryError: lỗi truy vấn thông tin user
	 * 		
	 */
	CreateUserActivation:function(activationInfo,transaction)
	{
		var err=new Error('CreateUserActivation.Error');
		function Validation()
		{
			var q=$q.defer();
			var systems=[];
			var mobileSystems=[];
			systems.push(HelperService.const.systemType.website);
			systems.push(HelperService.const.systemType.ios);
			systems.push(HelperService.const.systemType.android);
			mobileSystems.push(HelperService.const.systemType.ios);
			mobileSystems.push(HelperService.const.systemType.android);

			activationInfo.VerificationCode=randomstring.generate({
				length:o.const.verificationCodeLength,
				charset:'numeric'
			});
			activationInfo.VerificationToken=randomstring.generate({
				length:o.const.verificationTokenLength
			});
			try{
				if(_.isObject(activationInfo) && ! _.isEmpty(activationInfo))
				{
					//Check UserAccountId
					if(!activationInfo.UserUID)
					{
						err.pushError('UserUID.notProvided');
					}
					//Check system type
					if(!activationInfo.Type)
					{
						err.pushError('SystemType.notProvided');
					}
					else if(systems.indexOf(activationInfo.Type)>=0)
					{
						if(mobileSystems.indexOf(activationInfo.Type)>=0 && !activationInfo.DeviceID)
						{
							err.pushError('DeviceID.notProvided')
						}
					}
					else
					{
						err.pushError('SystemType.unknown');
					}
				}
				else
				{
					err.pushError("CreateUserActivation.paramsNotFound");
				}
				
				if(err.getErrors().length>0)
				{
					throw err;
				}
				else
				{
					q.resolve({result:'success'});
				}
			}
			catch(err){
				q.reject(err);
			}
			return q.promise;
		}

		return Validation()
		.then(function(success){
			return Services.UserAccount.GetUserAccountDetails({UID:activationInfo.UserUID},null,transaction)
			.then(function(user){
				if(o.checkData(user))
				{
					function CheckExist()
					{
						if(activationInfo.Type==HelperService.const.systemType.website)
						{
							return UserActivation.findOne({
								where:{
									UserAccountID:user.ID,
									Type:HelperService.const.systemType.website
								}
							},{transaction:transaction});
						}
						else
						{
							return UserActivation.findOne({
								where:{
									UserAccountID:user.ID,
									DeviceID:activationInfo.DeviceID
								}
							})
						}
					}

					return CheckExist()
					.then(function(activation){
						if(o.checkData(activation))
						{
							return activation.updateAttributes({
								VerificationCode:activationInfo.VerificationCode,
								VerificationToken:activationInfo.VerificationToken,
								TokenCreatedDate:new Date(),
								TokenExpired:o.const.tokenExpired,
								CodeExpired: o.const.codeExpired,
								ModifiedBy:activationInfo.CreatedBy||null
							},{transaction:transaction})
							.then(function(result){
								return result;
							},function(e){
								o.exlog(e);
								err.pushError("CreateUserActivation.updateActivationError");
								throw err;
							})
						}
						else
						{
							//create moi
							var insertInfo={
								UserAccountID:user.ID,
								Type:activationInfo.Type,
								VerificationCode:activationInfo.VerificationCode,
								VerificationToken:activationInfo.VerificationToken,
								CreatedBy:activationInfo.CreatedBy||null,
								TokenCreatedDate:new Date(),
								TokenExpired:o.const.tokenExpired,
								CodeExpired: o.const.codeExpired
							};
							if(activationInfo.Type!=HelperService.const.systemType.website)
							{
								insertInfo.DeviceID=activationInfo.DeviceID;
							}
							return UserActivation.create(insertInfo,{transaction:transaction})
							.then(function(result){
								return result;
							},function(e){
								o.exlog(e);
								err.pushError("CreateUserActivation.userActivationInsertError");
								throw err;
							})
							
						}
					},function(e){
						o.exlog(e);
						err.pushError("CreateUserActivation.checkExistQueryError");
						throw err;
					})
					
				}
				else
				{
					err.pushError("CreateUserActivation.userNotFound");
					throw err;
				}
			},function(e){
				o.exlog(e);
				err.pushError("CreateUserActivation.userQueryError")
				throw err;
			})

		},function(e){
			throw e;
		})
	},

	/**
	 * Activation: Activation account
	 * input:
	 *  -ActivationInfo:
	 *  	+Nếu là web system: UserUID, SystemType, VerificationToken
	 *  	+Nếu là mobile system: UserUID, SytemType, DeviceID, VerificationCode
	 *  -Transaction
	 *  output:
	 *  - Nếu thành công trả về {status:'success'}
	 *  - Nếu lỗi ném về error: trong error sẽ có mảng errors, mã lỗi cụ thể nằm ở phần tử errors thứ 0
	 *  	-errors[0]
	 *  		+ Activation.userNotProvided: chưa cung cấp UserUID
	 *  		+ Activation.systemTypeNotProvided: chưa cung cấp SystemType
	 *  		+ Activation.verificationTokenNotProvided: chưa cung cấp VerificationToken
	 *  		+ Activation.verificationCodeNotProvided: chưa cung cấp VerificataionCode
	 *  		+ Activation.deviceIdNotProvided: chưa cung cấp DeviceID
	 *  		+ Activation.systemTypeInvalid: SystemType không hợp lệ
	 *  		+ Activation.tokenInvalid: token không khớp
	 *  		+ Activation.tokenExpired: token đã hết hạn
	 *  		+ Activation.userUpdateError: không thể update UserAccount (Update Activated='Y')
	 *  		+ Activation.codeInvalid: code không khớp
	 *  		+ Activation.codeExpiredUpdateError: Không thể cập nhật field CodeExpired
	 *			+ Activation.codeExpired: đã nhập Code quá số lần cho phép
	 *			+ Activation.activationNotFound: không tìm thấy thông tin activation
	 *			+ Activation.getUserActivationQueryError: Lỗi truy vấn thông tin activation
	 *			+ Activation.userNotFound: không tìm thấy user tương ướng UserUID
	 *			+ Activation.userQueryError: lỗi khi truy vấn thông tin user
	 */
	Activation:function(activationInfo,transaction){
		var UserUID=null;
		var SystemType=null;
		var VerificationCode=null;
		var VerificationToken=null;
		var DeviceID=null;
		var error=new Error("Activation.Error");
		function Validation()
		{
			var q=$q.defer();
			try
			{
				if(o.checkData(activationInfo.UserUID))
				{
					UserUID=activationInfo.UserUID;
				}
				else
				{
					error.pushError("Activation.userNotProvided");
					throw error;
				}

				if(o.checkData(activationInfo.SystemType))
				{
					SystemType=activationInfo.SystemType;
				}
				else
				{
					error.pushError("Activation.systemTypeNotProvided");
					throw error;
				}
				
				if(SystemType==o.const.systemType.website)
				{
					if(o.checkData(activationInfo.VerificationToken))
					{
						VerificationToken=activationInfo.VerificationToken;
					}
					else
					{
						error.pushError("Activation.verificationTokenNotProvided");
						throw error;
					}
				}
				else if([o.const.systemType.ios,o.const.systemType.android].indexOf(SystemType)>=0)
				{
					if(o.checkData(activationInfo.VerificationCode))
					{
						VerificationCode=activationInfo.VerificationCode;
					}
					else
					{
						error.pushError("Activation.verificationCodeNotProvided");
						throw error;
					}
					if(o.checkData(activationInfo.DeviceID))
					{
						DeviceID=activationInfo.DeviceID;
					}
					else
					{
						error.pushError("Activation.deviceIdNotProvided");
						throw error;
					}
				}
				else
				{
					error.pushError("Activation.systemTypeInvalid");
					throw error;
				}
				q.resolve({status:'success'});
			}
			catch(err)
			{
				q.reject(err);
			}
			return q.promise;
		}

		return Validation()
		.then(function(data){
			return Services.UserAccount.GetUserAccountDetails({UID:UserUID},null,transaction)
			// return UserAccount.findOne({
			// 	where:{UID:UserUID}
			// },{transaction:transaction})
			.then(function(user){
				if(o.checkData(user))
				{
					function GetUserActivation()
					{
						if(SystemType==o.const.systemType.website)
						{
							//Nếu là web system thì kiểm tra record Activation của user có tồn tại
							//hay chưa dựa vào UserId và SystemType='WEB'
							VerificationToken=activationInfo.VerificationToken;
							return UserActivation.findOne({
								where:{UserAccountID:user.ID,Type:o.const.systemType.website}
							},{transaction:transaction})
						}
						else
						{
							//Nếu là mobile system thì kiểm tra record Activation của user có tồn tại
							//hay chưa dựa vào userId và DeviceId
							VerificationCode=activationInfo.VerificationCode;
							DeviceID=activationInfo.DeviceID;
							return UserActivation.findOne({
								where:{UserAccountID:user.ID,DeviceID:DeviceID}
							})
						}
					}
					return GetUserActivation()
					.then(function(activation){
						if(o.checkData(activation))
						{
							if(SystemType==o.const.systemType.website)
							{
								var tokenCreatedDate=moment(activation.TokenCreatedDate);
								var verificationDate= tokenCreatedDate.clone().add(activation.TokenExpired,'seconds');
								console.log('verificationDate:'+verificationDate.format("DD/MM/YYYY HH:mm:ss"));
								var current=moment();
								console.log('current:'+current.format("DD/MM/YYYY HH:mm:ss"));
								if(current.isBefore(verificationDate))
								{
									if(activation.VerificationToken==VerificationToken)
									{
										return {status:'sucess'};
									}
									else
									{
										error.pushError("Activation.tokenInvalid");
										throw error;
									}
								}
								else
								{
									error.pushError("Activation.tokenExpired");
									throw error;
								}
							}
							else
							{
								var codeExpired=activation.CodeExpired;
								if(codeExpired>0)
								{
									if(activation.VerificationCode==VerificationCode)
									{
										return user.updateAttributes({Activated:"Y"},{transaction:transaction})
										.then(function(data){
											return {status:'success'};
										},function(err){
											o.exlog(err);
											error.pushError("Activation.userUpdateError");
											throw error;
										})
									}
									else
									{
										return activation.updateAttributes({
											CodeExpired:(codeExpired-1)
										})/*{transaction:transaction}*/
										.then(function(data){
											console.log(data);
											error.pushError("Activation.codeInvalid")
											throw error;
										},function(err){
											o.exlog(err);
											error.pushError("Activation.codeExpiredUpdateError");
											throw error;
										});
										
									}
								}
								else
								{
									error.pushError("Activation.codeExpired");
									throw error;
								}
							}
						}
						else
						{
							error.pushError("Activation.activationNotFound");
							throw error;
						}
					},function(err){
						o.exlog(err);
						error.pushError("Activation.getUserActivationQueryError");
						throw error;
					})
				}	
				else
				{
					error.pushError("Activation.userNotFound");
					throw error;
				}
				
			},function(err){
				o.exlog(err);
				error.pushError("Activation.userQueryError");
				throw error;
			})
		},function(err){
			throw err;
		})
	},


	/**
	 * DeactivationUserAccount (for admin role) 
	 * deactivation thông qua các tiêu chí ID, UID , UserName, Email, Phone,
	 * chỉ cần 1 trong 5 tiêu chí được cung cấp thì user tương ứng sẽ bị deactivation
	 * Input:
	 * 	criteria: là json chứa 1 trong các thuộc tính [ID, UID, UserName, Email, Phone]
	 * 	transaction: nếu được cung cấp thì sẽ áp dụng transaction vào các câu truy vấn
	 * Output:
	 * 	if success return promise update UserAccount
	 * 	if error throw err;
	 */
	DeactivationUserAccount:function(criteria,transaction)
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
			var err=new Error('DeactivationUserAccount.Error');
			err.pushError('DeactivationUserAccount.criteriaNotFound');
			throw err;
		}
		return UserAccount.update({Activated:'N'},{
			where:whereClause
		},{transaction:transaction});
	},

	/**
	 * ActivationUserAccount (for admin role)
	 * activation thông qua các tiêu chí ID, UID, UserName, Email, Phone,
	 * chỉ cần 1 trong 5 tiêu chí được cung cấp thì user tương ứng sẽ được activation
	 * Input:
	 * 	criteria: là json chứa 1 trong các thuộc tính [ID, UID, UserName, Email, Phone]
	 * 	transaction: nếu được cung cấp thì sẽ áp dụng transaction vào các câu truy vấn
	 * Output:
	 * 	if success return promise update UserAccount
	 * 	if error throw err;
	 */
	ActivationUserAccount:function(criteria,transaction)
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
			var err=new Error('ActivationUserAccount.Error');
			err.pushError('ActivationUserAccount.criteriaNotFound');
			throw err;
		}
		return UserAccount.update({Activated:'Y'},{
			where:whereClause
		},{transaction:transaction});
	}

}
