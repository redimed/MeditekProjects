module.exports = {
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
	 * - req.body:{UserUID,Type,DeviceID(chỉ trong trường hợp Mobile System)}
	 * output: 
	 * 	nếu thành công trả status 200 cùng UserActivationInfo
	 * 	nếu lỗi thì trả về status 500 cùng error, trong error có mảng errors
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
	CreateUserActivation:function(req,res)
	{
		var activationInfo=req.body||{};
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
		},function(err){
			console.log(err);
			var error=new Error("CreateUserActivation.Error");
			error.pushError("CreateUserActivation.beginTransactionError");
			res.serverError(ErrorWrap(error));
		})
	},

	/**
	 * Activation: Activation account
	 * input:
	 *  -req.query:
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
	Activation:function(req,res)
	{
		var activationInfo=req.query||{};
		activationInfo.CreatedBy=req.user?req.user.ID:null;
		Services.UserActivation.Activation(activationInfo)
		.then(function(data){
			res.ok(data);
		},function(err){
			res.serverError(ErrorWrap(err));
		})
		
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