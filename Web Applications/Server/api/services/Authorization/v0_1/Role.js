var o=require("../../HelperService");
var $q = require('q');
module.exports={

	/**
	 * GetRoleByCode: lấy thông tin Role thông qua role code
	 * input: 
	 * - RoleCode
	 * - transaction
	 * output:
	 * 	-Nếu query success return role or null
	 * 	-Nếu query fail return error
	 */
	GetRoleByCode:function(RoleCode, attributes,transaction){
		var error=new Error('GetRoleByCode.Error');
		function Validation()
		{
			var q=$q.defer();
			try{
				if(!o.checkData(RoleCode))
				{
					error.pushError("GetRoleByCode.roleNotProvided");
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
			catch(err)
			{
				q.reject(err);
			}
			return q.promise;
		}
		
		return Validation()
		.then(function(data){
			return Role.findOne({
				where:{RoleCode:RoleCode},
				attributes:attributes
			})
			.then(function(role){
				return role;
			},function(err){
				console.log(err);
				error.pushError("GetRoleByCode.queryError");
				throw error;
			})
		});
		
	}
}