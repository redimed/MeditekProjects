/**
 * @namespace UserAccount
 * @memberOf Controller
 */
var regexp = require('node-regexp');
var underscore=require('underscore');
var moment=require('moment');
var o=require("../../../services/HelperService");
module.exports = {
	Test:function(req,res)
	{
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
		UserAccount.findAll({
			limit:1,
		})
		.then(function(data){
			res.ok(data);
		},function(err){
			res.serverError(err);
		})
	},
	
	/**
	 * @function CreateUserAccount
	 * @memberOf Controller.UserAccount
	 * @param {object} req resquest
	 * @param {object} req.body 
	 * @param {string} [req.body.UserName] 
	 * @param {string} [req.body.Email] 
	 * @param {string} [req.body.PhoneNumber] 
	 * @param {string} req.body.Password
	 * @param {object} res response
	 * @return {object} New UserAccount
	 * @throws {Service.UserAccount.CreateUserAccountException}
	 * @summary Một trong req.body.UserName, req.body.Email, req.body.PhoneNumber cần có giá trị
	 */
	CreateUserAccount:function(req,res){
		var userInfo={
			UserName:req.body.UserName,
			Email:req.body.Email,
			PhoneNumber:req.body.PhoneNumber,
			PinNumber:req.body.PinNumber,
			Password:req.body.Password,
			Activated:'Y',
			Enable:'Y',
			CreatedBy:req.user?req.user.ID:null,
		}
		
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
	 * @function FindByPhoneNumber
	 * @memberOf Controller.UserAccount
	 * @summary Tìm User bằng PhoneNumber
	 * @param {object} req request
	 * @param {object} req.query
	 * @param {string} req.query.PhoneNumber
	 * @return {obj} userAccount
	 * @throws {Service.UserAccount.FindByPhoneNumberException}
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
	 * @function UpdateUserAccount
	 * @memberOf Controller.UserAccount
	 * @param {object} req request
	 * @param {object} req.body Thông tin của user cần cập nhật
	 * @param {object} res response
	 * @return {object} updated userAccount info
	 * @throws {Service.UserAccount.UpdateUserAccountException}
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
	 * @typedef {object} DisableUserAccountException
	 * @memberOf Controller.UserAccount
	 * @property {string} ErrorType "DisableUserAccount.Error"
	 * @property {Array.<string|object>} ErrorsList Chỉ xét phần tử ErrorsList[0]</br>
	 * - Request.missingParams</br>
	 * - User.notFound</br>
	 */
	/**
	 * @function DisableUserAccount
	 * @memberOf Controller.UserAccount
	 * @summary Disable UserAccount.
	 * Cần cung cấp 1 trong 4 tiêu chí UID, UserName, Email, Phone
	 * @param {object} req request
	 * @param {object} req.body
	 * @param {string} [req.body.UID] uid của user
	 * @param {string} [req.body.UserName] 
	 * @param {string} [req.body.Email]
	 * @param {string} [req.body.Phone]
	 * @param {object} res response
	 * @return {Number} trả về số 1 nếu thành công
	 * @throws {Controller.UserAccount.DisableUserAccountException}
	 * @throws {Service.UserAccount.DisableUserAccountException}
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
	 * @typedef {object} EnableUserAccountException
	 * @memberOf Controller.UserAccount
	 * @property {string} ErrorType EnableUserAccount.Error
	 * @property {Array.<string|object>} ErrorsList Chỉ sử dụng ErrorsList[0]</br>
	 * - Request.missingParams</br>
	 * - User.notFound</br>
	 */
	/**
	 * @function EnableUserAccount
	 * @memberOf Controller.UserAccount
	 * @summary Enable UserAccount.
	 * Cần cung cấp 1 trong 4 tiêu chí UID, UserName, Email, Phone
	 * @param {object} req request
	 * @param {object} req.body
	 * @param {string} [req.body.UID] UID của user
	 * @param {string} [req.body.UserName] 
	 * @param {string} [req.body.Email] 
	 * @param {string} [req.body.Phone] 
	 * @return {Number} trả về 1 nếu thành công
	 * @throws {Controller.UserAccount.EnableUserAccountException} 
	 * @throws {Service.UserAccount.EnableUserAccountException}
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
	 * @typedef {object} GetUserAccountDetailsException
	 * @memberOf Controller.UserAccount
	 * @property {string} ErrorType "GetUserAccountDetails.Error"
	 * @property {Array.<string|object>} ErrorsList Chỉ sử dụng ErrorsList[0]</br>
	 * - Request.missingParams</br>
	 * - User.notFound</br>
	 */
	/**
	 * @function GetUserAccountDetails
	 * @memberOf Controller.UserAccount
	 * @summary Lấy thông tin chi tiết của user.
	 * Cần cung cấp 1 trong 4 tiêu chí UID, UserName, Email, Phone
	 * @param {object} req request
	 * @param {object} req.query 
	 * @param {object} [req.query.UID] UID của user
	 * @param {string} [req.query.UserName] 
	 * @param {string} [req.query.Email] 
	 * @param {string} [req.query.PhoneNumber] 
	 * @return {object} userInfo
	 * @throws {Controller.UserAccount.GetUserAccountDetailsException}
	 * @throws {Service.UserAccount.GetUserAccountDetailsException}
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
	 * @typedef {object} GetListUsersException
	 * @memberOf Controller.UserAccount
	 * @property {string} ErrorType "GetListUsers.Error"
	 * @property {Array.<string|object>} ErrorsList Chỉ sử dụng ErrorsList[0]</br>
	 * - Request.missingParams
	 */
	/**
	 * @typedef {object} GetListUsersReturn
	 * @memberOf Controller.UserAccount
	 * @property {Number} totalRows Tổng số kết quả thỏa mãn điều kiện
	 * @property {Array.<object>} rows Mảng chứ dữ liệu của 1 page
	 */
	/**
	 * @function GetListUsers
	 * @memberOf Controller.UserAccount
	 * @summary Lấy danh sách UserAccount (Chức năng chỉ dành cho admin)
	 * @param {object} req request
	 * @param {object} req.body 
	 * @param {object} req.body.criteria 
	 *        Là một json chứa các field điều kiện, ví dụ: {"UserName":"ta","Email":"tan@gmail.com"}
	 * @param {object} req.body.attributes 
	 *        Là một mảng chứa các field thông tin trả về, ví dụ: ["ID","UserName"]
	 * @param {object} req.body.order
	 *        Là một json chứa tên field cần sắp xếp và kiểu sắp xếp, ví dụ:{"UserName":"ASC"}
	 * @param {Number} req.body.limit Trả về bao nhiêu dòng dữ liệu trong tổng số kết quả
	 * @param {Number} req.body.offset 
	 *        Bỏ qua bao nhiêu dòng dữ liệu đầu tiên(hoặc có thể hiểu là thứ tự dòng bắt đầu được lấy, số dòng đánh dấu bắt đầu từ 0)
	 * @param {object} res response
	 * @return {Controller.UserAccount.GetListUsersReturn} 
	 * @throws {Controller.UserAccount.GetListUsersException}
	 * @throws {Service.UserAccount.GetListUsersException}
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
	 * @typedef {RemoveIdentifierImageException}
	 * @memberOf Controller.UserAccount
	 * @property {string} ErrorType "RemoveIdentifierImage.Error"
	 * @property {Array.<string|object>} ErrorsList Chỉ sử dụng ErrorsList[0]
	 * - RemoveIdentifierImage.transactionBeginError
	 */
	/**
	 * @function RemoveIdentifierImage
	 * @memberOf Controller.UserAccount
	 * @summary xóa thông tin file hồ sơ của user
	 * @param {object} req request
	 * @param {object} req.body 
	 * Cần cung cấp 1 trong các tham số UserUID, UserName, Email, PhoneNumber
	 * @param {string} [req.body.UserUID]
	 * @param {string} [req.body.UserName]
	 * @param {string} [req.body.Email]
	 * @param {string} [req.body.PhoneNumber]
	 * @param {string} req.body.Type (ProfileImage hoặc Signature)
	 * @return {{status:"success"}}
	 * @throws {Controller.UserAccount.RemoveIdentifierImageException}
	 * @throws {Service.UserAccount.RemoveIdentifierImageException}
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
	 * @function GetIdentifierImageInfo
	 * @memberOf Controller.UserAccount
	 * @summary Lấy thông tin file hồ sơ của user
	 * @param {object} req request
	 * @param {object} req.body 
	 * Cần cung cấp 1 trong các tham số UserUID, UserName, Email, PhoneNumber
	 * @param {string} [req.body.UserUID]
	 * @param {string} [req.body.UserName]
	 * @param {string} [req.body.Email]
	 * @param {string} [req.body.PhoneNumber]
	 * @param {string} req.body.Type (ProfileImage hoặc Signature)
	 * @return {object} File Info
	 * @throws {Service.UserAccount.GetIdentifierImageInfoException}
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