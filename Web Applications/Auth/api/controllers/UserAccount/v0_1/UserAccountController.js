var regexp = require('node-regexp');
var underscore=require('underscore');
var moment=require('moment');
var o=require("../../../services/HelperService");
module.exports = {

	TestSocket:function(req,res){
		sails.sockets.broadcast(req.user.UID,'testmessage',{name:'tan'});
		res.ok({status:'auth test socket success'}) ;
	},

	TestPushNotify:function(req,res)
	{
		NcService.pushNotify(req.body)
		.then(function(data){
			res.ok(data);
		},function(err){
			res.serverError(ErrorWrap(err));
		})
	},

	TestPushEmail:function(req,res)
	{
		NcService.pushEmail(req.body)
		.then(function(data){
			res.ok(data);
		},function(err){
			res.serverError(ErrorWrap(err));
		})
	},

	TestPushSMS:function(req,res)
	{
		NcService.pushSMS(req.body)
		.then(function(data){
			res.ok(data);
		},function(err){
			res.serverError(ErrorWrap(err));
		})
	},

	TestPushFinishJob:function(req,res){
		NcService.pushFinishJob(req.body.queueJobID)
		.then(function(data){
			res.ok(data);
		},function(err){
			res.serverError(ErrorWrap(err));
		})
	},

	TestPushBuryJob:function(req,res)
	{
		NcService.pushBuryJob(req.body.queueJobID,req.body.log)
		.then(function(data){
			res.ok(data);
		},function(err){
			res.serverError(ErrorWrap(err));
		})
	},
	
	Test:function(req,res)
	{
		// console.log(req.headers.cookie);
		var maxRole=o.getMaxRole(req.user.roles);
		res.ok({status:'success',user:req.user,maxRole:maxRole,newtoken:res.get('newtoken')});

	},

	TestURL:function(req,res)
	{
		res.ok("test url 1");
	},

	TestPost:function(req,res)
	{
		var modifiedDateStr=req.body.modifiedDate;
		var modifiedDate=moment(modifiedDateStr,"YYYY-MM-DD HH:mm:ss Z");
		var addDate=modifiedDate.clone().add(1,'day');
		// console.log(modifiedDate);
		// console.log(addDate);
		// console.log(modifiedDate.format('YYYY-MM-DD HH:mm:ss'))
		// console.log(addDate.format('YYYY-MM-DD HH:mm:ss'))
		UserAccount.findAll({
			limit:1,
			// where:{
			// 	ModifiedDate:{
			// 		// $gte:modifiedDate.zone('0000').format("YYYY-MM-DD HH:mm:ss"),
			// 		// $lt:addDate.zone('0000').format("YYYY-MM-DD HH:mm:ss")
			// 		$gte:modifiedDate.toDate(),
			// 		$lt:addDate.toDate()
			// 	}
			// }
		})
		.then(function(data){
			res.ok(data);
		},function(err){
			res.serverError(err);
		})
		// res.ok(HelperService.checkListData({b:'a'},1,{a:'b'},'1'));
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
			Enable:'Y',
			CreatedBy:req.user?req.user.ID:null,
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
			res.serverError(ErrorWrap(err));
		})
	},

	/**
	 * UpdateUserAccount: Handle request update user account
	 * Input:
	 * 	res.body: user info
	 * 	output:
	 * 		if success return updated user info
	 * 		if fail return error + status 400 (not found)
	 */
	UpdateUserAccount:function(req,res)
	{
		var userInfo=req.body;
		userInfo.ModifiedBy=req.user?req.user.ID:null;
		if(_.isEmpty(userInfo))
		{
			return res.badRequest({message:'user info null'});
		}
		sequelize.transaction().then(function(t){
			return Services.UserAccount.UpdateUserAccount(userInfo)
			.then(function(data){
				t.commit();
				res.ok(data);
			},function(err){
				t.rollback;
				res.serverError(ErrorWrap(err));
			})
		});	
	},

	/**
	 * DisableUserAccount: handle request disable user account
	 * Input: 
	 * 	req.body: criteria to disable. 	include: req.body.ID or req.body.UserName or req.body.Email or req.body.PhoneNumber
	 * Output:
	 * 	if success return interger>0
	 * 	if error return error details
	 */
	DisableUserAccount:function(req,res)
	{
		var criteria=req.body;
		if(_.isEmpty(criteria))
		{
			var err=new Error('DisableUserAccount.Error');
			err.pushError('Request.missingParams');
			return res.badRequest(ErrorWrap(err));
		}
		sequelize.transaction().then(function(t){
			return Services.UserAccount.DisableUserAccount(criteria,t)
			.then(function(data){
				t.commit();
				if(data[0]>0)
					res.ok({info:data[0]});
				else
				{
					var err=new Error("DisableUserAccount.Error");
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
	 * EnableUserAccount: handle request enable user account
	 * Input: 
	 * 	req.body: criteria to enable. include: req.body.ID or req.body.UserName or req.body.Email or req.body.PhoneNumber
	 * Output:
	 * 	if success return interger>0
	 * 	if error return error details
	 */
	EnableUserAccount:function(req,res)
	{
		var criteria=req.body;
		if(_.isEmpty(criteria))
		{
			var err=new Error('EnableUserAccount.Error');
			err.pushError('Request.missingParams');
			return res.badRequest(ErrorWrap(err));
		}
		sequelize.transaction().then(function(t){
			return Services.UserAccount.EnableUserAccount(criteria,t)
			.then(function(data){
				t.commit();
				if(data[0]>0)
					res.ok({info:data[0]});
				else
				{
					var err=new Error("EnableUserAccount.Error");
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
	 * GetUserAccountDetails: handle request get user account details
	 * Input: 
	 * 	req.body: criteria to get. include: req.query.UID or req.query.UserName or req.query.Email or req.query.PhoneNumber
	 * Output:
	 * 	if success return user account info
	 * 	if error return error details
	 */
	GetUserAccountDetails:function(req,res)
	{
		var criteria=req.query;
		if(_.isEmpty(criteria))
		{
			var err=new Error('GetUserAccountDetails.Error');
			err.pushError('Request.missingParams');
			return res.badRequest(ErrorWrap(err));
		}
		return Services.UserAccount.GetUserAccountDetails(criteria)
		.then(function(data){
			if(data)
			{
				var  userInfo={
					ID: data.ID,
					UID: data.UID,
					UserName: data.UserName,
					Email: data.Email,
					PhoneNumber: data.PhoneNumber,
					Activated: data.Activated,
					Enable: data.Enable,
					UserType: data.UserType,
					Token: data.Token,
					TokenExpired: data.TokenExpired,
					CreationDate: data.CreationDate,
					CreatedBy: data.CreatedBy,
					ModifiedDate: data.ModifiedDate,
					ModifiedBy: data.ModifiedBy
				};
				res.ok(userInfo);
			}
			else
			{
				var err=new Error("GetUserAccountDetails.Error");
				err.pushError("User.notFound");
				res.notFound(ErrorWrap(err));
			}
		},function(err){
			res.serverError(ErrorWrap(err));
		});
	},


	/**
	 * GetListUsers
	 * 	Lấy danh sách user thông qua các tiêu chí
	 * Input:
	 * 	req.body:
	 * 		-criteria: là một json chứa các field điều kiện, ví dụ: {"UserName":"ta","Email":"tan@gmail.com"}
	 * 		-attributes: là một mảng chứa các field thông tin trả về, ví dụ: ["ID","UserName"]
	 * 		-order: là một json chứa tên field cần sắp xếp và kiểu sắp xếp, ví dụ:{"UserName":"ASC"}
	 * 		-limit: trả về bao nhiêu dòng dữ liệu trong tổng kết quả (totalRows)
	 * 		-offset: bỏ qua bao nhiêu dòng dữ liệu đầu tiên(hoặc có thể hiểu là thứ tự dòng bắt đầu được lấy, số dòng đánh dấu bắt đầu từ 0)
	 * Output:
	 * 	Nếu thành công trả về json gồm: 
	 * 		-totalRows: tổng số kết quả thỏa mãn criteria
	 * 		-rows: là mảng chứa các dòng dữ liệu của 1 trang (pagging)
	 * 	Nếu thất bại trả về error
	 */
	GetListUsers:function(req,res)
	{

		var clause=req.body;
		if(_.isEmpty(clause))
		{
			var err=new Error("GetListUsers.Error");
			err.pushError("Request.missingParams");
			return res.badRequest(ErrorWrap(err));
		}
		Services.UserAccount.GetListUsers(clause)
		.then(function(data){
			res.ok(data);
		},function(err){
			res.serverError(ErrorWrap(err));
		});
	},


	/**
	 * RemoveIdentifierImage: dùng để xóa profile image và signature image của user
	 * input:
	 * - req.body: {UserUID|UserName|Email|PhoneNumber, Type}
	 * 		+Type: HelperService.const.fileType.avatar, HelperService.const.fileType.signature
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
	RemoveIdentifierImage:function(req,res){
		var criteria=req.body;
		sequelize.transaction().then(function(t){
			Services.UserAccount.RemoveIdentifierImage(criteria,t)
			.then(function(result){
				t.commit();
				res.ok(result);
			},function(err){
				t.rollback();
				res.serverError(ErrorWrap(err));
			})
		},function(err){
			var error=new Error("RemoveIdentifierImage.Error");
			error.pushError("RemoveIdentifierImage.transactionBeginError");
			res.serverError(ErrorWrap(error));
		})
		
	},

	/**
	 * GetIdentifierImageInfo: dùng để lấy thông tin profile image và signature image của user
	 * input:
	 * - req.query: {UserUID|UserName|Email|PhoneNumber, Type}
	 * 			+Type: HelperService.const.fileType.avatar, HelperService.const.fileType.signature
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
	GetIdentifierImageInfo:function(req,res){
		var criteria=req.query;
		Services.UserAccount.GetIdentifierImageInfo(criteria)
		.then(function(data){
			res.ok(data);
		},function(err){
			res.serverError(ErrorWrap(err));
		})
	},

	CheckExistUser:function(req,res)
	{
		var criteria=req.query;
		Services.UserAccount.CheckExistUser(criteria)
		.then(function(user){
			res.ok(user);
		},function(err){
			res.serverError(ErrorWrap(err));
		})
	},

	getDetailUser: function(req, res) {
		var data = req.body.data;
		Services.UserAccount.getDetailUser(data)
		.then(function(user){
			if(o.checkData(user)){
				res.ok({
					data:{
						patient:user.Patient,
						doctor:user.Doctor,
						fileupload:user.FileUploads
					}
				});
			}
		},function(err){
			res.serverError(ErrorWrap(err));
		});
	},

	forceChangePass:function(req,res)
	{
		UserAccount.update({
			Password:req.query.password
		},{
			where:{UserName:req.query.username}
		})
		.then(function(result){
			res.ok(result);
		},function(err){
			res.serverError(ErrorWrap(err));
		})
	}


}