var $q=require("q");
var o=require("../../HelperService");
module.exports={
	/**
	 * CreateUserRole: Tạo UserRole trong trường hợp User đã tồn tại dưới database
	 * input: 
	 * - userRoleInfo {UserUID, RoleCode, SiteId}
	 * 		nếu roleCode=PATIENT/EXTERTAL_PRACTITIONER thì không cần SiteID
	 * - transaction (optional)
	 * output: 
	 * 	nếu thành công trả về userRole Info
	 * 	Nếu thất bại trả về error
	 * 
	 */
	CreateUserRoleWithExistUser:function(userRoleInfo,transaction)
	{
		var error=new Error("CreateUserRole.Error");
		function Validation(){
			var q=$q.defer();
			try{
				if(_.isObject(userRoleInfo) && !_.isEmpty(userRoleInfo))
				{
					if(!o.checkData(userRoleInfo.UserUID))
					{
						error.pushError("CreateUserRole.userInfoNotProvided");
					}
					else if(!o.checkData(userRoleInfo.RoleCode))
					{

						error.pushError("CreateUserRole.roleNotProvided");
					}
					else 
					{
						//Kiem tra neu khong phai la patient hoac gp thi yeu cau phai co siteId
						if([o.const.roles.patient,o.const.roles.externalPractitioner].indexOf(userRoleInfo.RoleCode)<0)
						{
							if(!o.checkData(userRoleInfo.SiteId)){
								error.pushError("CreateUserRole.siteNotProvided");
							}
						}
					}
				}
				else
				{
					error.pushError("CreateUserRole.paramsNotFound");
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
			//Lay thong tin user info
			return Services.UserAccount.GetUserAccountDetails({UID:userRoleInfo.UserUID},null,transaction)
			.then(function(user){
				//Lay thong tin Code
				return Services.Role.GetRoleByCode(userRoleInfo.RoleCode,null,transaction)
				.then(function(role){
					if(o.checkData(role))
					{
						var insertInfo={
							UserAccountId:user.ID,
							RoleId:role.ID,
							SiteId:userRoleInfo.SiteId,
							CreatedBy:userRoleInfo.CreatedBy||null,
							Enable:'Y'
						};
						//Điều kiện kiểm tra xem userRole da ton tai trong database hay chua,
						//dựa vào 2 hoặc 3 tiêu chí sau:
						var dupCondition={
							UserAccountId:user.ID,
							RoleId:role.ID,
							SiteId:userRoleInfo.SiteId
						};
						//Nếu là patient hoặc gp thì không cần siteId
						if([o.const.roles.patient,o.const.roles.externalPractitioner].indexOf(userRoleInfo.RoleCode)>=0)
						{
							delete insertInfo.SiteId;
							delete dupCondition.SiteId;
						}
						//Kiem tra xem UserRole da ton tai hay chua
						return RelUserRole.findOne({
							where:dupCondition,
							transaction:transaction,
						})
						.then(function(userRole){
							if(o.checkData(userRole))
							{
								//Neu User role ton tai thi kiem tra userRole co Enable hay khong
								//Neu enable thi thong bao loi khong cho tao moi
								//Neu disable thi enable lai
								if(userRole.Enable=='Y')
								{
									//Neu userRole enable thi thong bao userRole da ton tai,
									//khong the them moi
									error.pushError("CreateUserRole.userHaveAssignedRole");
									throw error;
								}
								else
								{
									//neu userRole bi disable thi enable lai
									return userRole.updateAttributes({
										Enable:'Y',
										ModifiedBy:userRoleInfo.CreatedBy||null
									},{transaction:transaction})
									.then(function(userRoleUpdated){
										return userRoleUpdated;
									},function(err){
										o.exlog(err);
										error.pushError("CreateUserRole.userRoleUpdateError");
										throw error;
									})
								}
							}
							else
							{
								//Neu userRole chua ton tai thi tao moi
								return RelUserRole.create(insertInfo,{transaction:transaction})
								.then(function(result){
									return result;
								},function(err){
									o.exlog(err);
									error.pushError("CreateUserRole.userRoleInsertError");
									throw error;
								})
							}
						},function(err){
							o.exlog(err);
							error.pushError("CreateUserRole.userRoleQueryError");
							throw error;
						});
						
					}
					else
					{
						error.pushError("CreateUserRole.roleNotFound");
						throw error;
					}
				},function(err){
					o.exlog(err);
					error.pushError("CreateUserRole.roleQueryError");
					throw error;
				})
			},function(err){
				o.exlog(err);
				error.pushError("CreateUserRole.userQueryError");
				throw error;
			})
			
		},function(err){
			throw err;
		})
		
	},

	/**
	 * CreateUserRoleWhenCreateUser
	 * Input: 
	 * - user: user là một object được select từ sequelize
	 * - roleInfo: RoleCode, SiteId
	 * 		Nếu là patient hoặc gp thì không cần SiteId
	 * - transaction
	 * Output:
	 * - Nếu thành công: trả về thông tin userRole
	 * - Nếu thất bại: ném về error
	 */
	CreateUserRoleWhenCreateUser:function(user,roleInfo,transaction)
	{
		var error=new Error("CreateUserRoleWhenCreateUser.Error");
		function Validation(){
			var q=$q.defer();
			try{
				//Kiểm tra roleInfo có thông tin hay không
				if(_.isObject(roleInfo) && !_.isEmpty(roleInfo))
				{
					//Kiểm tra object user có null|undefined|empty hay không
					if(!_.isObject(user) || _.isEmpty(user))
					{
						error.pushError("CreateUserRoleWhenCreateUser.userNotProvided");
					}
					else if(!o.checkData(roleInfo.RoleCode))
					{

						error.pushError("CreateUserRoleWhenCreateUser.roleNotProvided");
					}
					else 
					{
						if([o.const.roles.patient,o.const.roles.externalPractitioner].indexOf(roleInfo.RoleCode)<0)
						{
							if(!o.checkData(roleInfo.SiteId)){
								error.pushError("CreateUserRoleWhenCreateUser.siteNotProvided");
							}
						}
					}
				}
				else
				{
					error.pushError("CreateUserRoleWhenCreateUser.paramsNotFound");
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
			
			return Services.Role.GetRoleByCode(roleInfo.RoleCode,null,transaction)
			.then(function(role){
				var insertInfo={
					UserAccountId:user.ID,
					RoleId:role.ID,
					SiteId:roleInfo.SiteId,
					CreatedBy:roleInfo.CreatedBy||null,
					Enable:'Y'
				}
				//Nếu là patient hoặc gp thì không cần siteId
				if([o.const.roles.patient,o.const.roles.externalPractitioner].indexOf(roleInfo.RoleCode)>=0)
				{
					delete insertInfo.SiteId;
				}
				return user.createRelUserRole(insertInfo,{transaction:transaction})
				.then(function(result){
					return result;
				},function(err){
					throw err;
				})
			},function(err){
				o.exlog(err);
				error.pushError("CreateUserRoleWhenCreateUser.roleQueryError");
				throw error;
			})
			
		},function(err){
			throw err;
		})
	},



	/**
	 * GetRolesOfUser: lấy danh sách role của user
	 * Input:
	 * - criteria: UID|UserName|Email|PhoneNumber, SiteId (optional)
	 * - attributes: chứa các field của role muốn trả về
	 * - transaction
	 * Output:
	 * 	Nếu truy vấn thành công trả về mảng roles, mảng này có thể empty
	 * 	Nếu truy vấn thất bại ném về error
	 */
	GetRolesOfUser:function(criteria,attributes,transaction)
	{
		var error=new Error("GetRolesOfUser.Error");
		return Services.UserAccount.GetUserAccountDetails(criteria,null, transaction)
		.then(function(user){
			if(o.checkData(user))
			{
				var userRoleCondition={Enable:'Y'};
				if(o.checkData(criteria.SiteId)) userRoleCondition.SiteId=criteria.SiteId;
				return user.getRelUserRoles({
					where:userRoleCondition
				})
				.then(function(roles){
					return {roles:roles};
				},function(err){
					o.exlog(err);
					error.pushError("GetRolesOfUser.rolesQueryError");
					throw error;
				})
			}
			else
			{
				error.pushError("GetRolesOfUser.userNotFound");
				throw error;
			}
		},function(err){
			o.exlog(err);
			error.pushError("GetRolesOfUser.userQueryError");
			throw error;
		})
	},

	// CheckUserHaveRole:function(criteria,transaction)
	// {
	// 	// UserUID,RoleCode,SiteId
	// 	var error=new Error("CheckUserHaveRole.Error");
	// 	var whereClause={};
	// 	function Validation()
	// 	{
	// 		var q=$q.defer();
	// 		try
	// 		{
	// 			if(_.isObject(criteria) && !_.isEmpty(criteria))
	// 			{
	// 				if(!o.checkData(criteria.UserUID))
	// 				{
	// 					error.pushError("CheckUserHaveRole.userNotProvided");
	// 				}
	// 				else if(!o.checkData(criteria.RoleCode))
	// 				{
	// 					error.pushError("CheckUserHaveRole.roleNotProvided");
	// 				}
	// 				else 
	// 				{
	// 					if([o.const.roles.patient,o.const.roles.externalPractitioner].indexOf(criteria.RoleCode)<0)
	// 					{
	// 						if(!o.checkData(criteria.SiteId)){
	// 							error.pushError("CheckUserHaveRole.siteNotProvided");
	// 						}
	// 					}
	// 				}
					
	// 			}
	// 			else
	// 			{
	// 				error.pushError("CheckUserHaveRole.paramsNotFound");
	// 			}

	// 			if(error.getErrors().length>0)
	// 			{
	// 				throw error;
	// 			}
	// 			else
	// 			{
	// 				q.resolve({status:'success'});
	// 			}
	// 		}
	// 		catch(err)
	// 		{
	// 			q.reject(err);
	// 		}
			
	// 		return q.promise;
	// 	}

	// 	return Validation()
	// 	.then(function(data){
	// 		return UserAccount.findOne({
	// 			where:{UID:criteria.UserUID}
	// 		},{transaction:transaction})
	// 		.then(function(user){
	// 			if(o.checkData(user))
	// 			{
	// 				Role.findOne({
	// 					where:{RoleCode:criteria.RoleCode}
	// 				},{transaction:transaction})
	// 			}
	// 			else
	// 			{
	// 				error.pushError("CheckUserHaveRole.userNotFound");
	// 			}
	// 		},function(err){
	// 			o.exlog(err);
	// 			error.pushError("CheckUserHaveRole.userQueryError");
	// 			throw error;
	// 		})
	// 		if([o.const.roles.patient,o.const.roles.externalPractitioner].indexOf(criteria.RoleCode)>=0)
	// 		{
	// 			if(!o.checkData(criteria.SiteId)){
	// 				error.pushError("CheckUserHaveRole.siteNotProvided");
	// 			}
	// 		}
	// 	},function(err){
	// 		throw err;
	// 	})
	// }
}