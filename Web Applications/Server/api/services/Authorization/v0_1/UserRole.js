var $q=require("q");
var o=require("../../HelperService");
module.exports={
	/**
	 * CreateUserRole: Tạo UserRole
	 * input: 
	 * - userRoleInfo {UserUID, RoleCode, SiteId}
	 * 		nếu roleCode=PATIENT/EXTERTAL_PRACTITIONER thì không cần SiteID
	 * - transaction (optional)
	 * output: 
	 * 	nếu thành công trả về userRole Info
	 * 	Nếu thất bại trả về error
	 * 
	 */
	CreateUserRole:function(userRoleInfo,transaction)
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
			return Services.UserAccount.GetUserAccountDetails({UID:userRoleInfo.UserUID},null,transaction)
			.then(function(user){
				return Services.Role.GetRoleByCode(userRoleInfo.RoleCode,null,transaction)
				.then(function(role){
					if(o.checkData(role))
					{
						var insertInfo={
							UserAccountId:user.ID,
							RoleId:role.ID,
							SiteId:userRoleInfo.SiteId
						}
						return RelUserRole.create(insertInfo,{transaction:transaction})
						.then(function(result){
							return result;
						},function(err){
							o.exlog(err);
							error.pushError("CreateUserRole.userRoleInsertError");
							throw error;
						})
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


	GetRolesOfUser:function(criteria,attributes,transaction)
	{
		var error=new Error("GetRolesOfUser.Error");

		return Services.UserAccount.GetUserAccountDetails(criteria,null, transaction)
		.then(function(user){
			if(o.checkData(user))
			{
				return user.getRelUserRoles()
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
}